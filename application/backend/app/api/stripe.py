import requests
import json
import logging
from flask import views, request, redirect, jsonify, current_app
from flask_smorest import Blueprint, abort
from app.repositories.user_repository import UserRepository
from app.models.user_schema import UserSchema
from app.models.stripe_customer_schema import StripeCustomerSchema
from app.models.stripe_customer import StripeCustomer
from app.auth import auth
from flask_jwt_extended import jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies, current_user
from app.services.slack_organization_service import SlackOrganizationService
from app.services.injector import injector
import stripe
from app.services.stripe_customer_service import StripeCustomerService
from datetime import datetime, timezone


bp = Blueprint("stripe", "stripe", url_prefix="/stripe", description="Stripe payments")

@bp.route("/products")
class Stripe(views.MethodView):
    @jwt_required()
    def get(self):
        # identity = get_jwt_identity()
        # user = UserRepository.get_by_id(identity)
        products = stripe.Price.list(expand=['data.product'])
        return jsonify(products)



@bp.route('/create-checkout-session')
class Stripe(views.MethodView):
    #@jwt_required()
    def post(self):
        
        team_id = "T05MQ6CCQ2C"
        #team_id = current_user.slack_organization_id
        stripe_service:StripeCustomerService = injector.get(StripeCustomerService)
        stripe_customer: StripeCustomer = stripe_service.get_by_team_id(team_id=team_id)

        if stripe_customer: 
            print(stripe_customer.__dict__)

        try:
            prices = stripe.Price.list(
                expand=['data.product']
            )

            pizzabot_premium_ref = [ref for ref in prices if ref["product"]["name"] == "PizzaBot Premium"][0]
            # print(prices)

            checkout_session = None

            #checkout session for existing customer
            if stripe_customer:
                checkout_session = stripe.checkout.Session.create(
                    customer = stripe_customer.customer_id,
                    line_items=[
                        {
                            'price': pizzabot_premium_ref.id,
                            'quantity': 1,
                        },
                    ],
                    mode='subscription',
                    success_url="https://google.com",
                    cancel_url="https://yahoo.com",
                )
            
            else: 
                checkout_session = stripe.checkout.Session.create(
                    client_reference_id = team_id,
                    line_items=[
                        {
                            'price': pizzabot_premium_ref.id,
                            'quantity': 1,
                        },
                    ],
                    mode='subscription',
                    success_url="https://google.com",
                    cancel_url="https://yahoo.com",
                )

            res = jsonify({'sessionId': checkout_session['id'], 'url': checkout_session['url']})
            
            return res
        except Exception as e:
            return jsonify(e)
    

@bp.route('/webhook')
class Stripe(views.MethodView):
    def post(self):
        logger = injector.get(logging.Logger)
        stripe_service: StripeCustomerService = injector.get(StripeCustomerService)
        payload = request.data
        event = None

        # TODO: this is not secure, enforce secret for production
        endpoint_secret = None #app.config['STRIPE_WEBHOOK_SECRET']

        try:
            # Only verify the event if there is an endpoint secret defined
            # Otherwise use the basic event deserialized with json
            if endpoint_secret:
                sig_header = request.headers['STRIPE_SIGNATURE']
                
                event = stripe.Webhook.construct_event(
                    payload, sig_header, endpoint_secret
                )
            else:
                event = json.loads(payload)


            # Handle the event
            if event['type'] in ["checkout.session.completed"]:
                session = event['data']["object"]
                client_reference_id = session.get("client_reference_id")
                stripe_customer_id = session.get("customer")

                print("session: ", session)
                print("client_ref_id: ", client_reference_id)
                print("stripe customer: ", stripe_customer_id)

                
                #new user
                if client_reference_id:
                    schema_data = {
                        "slack_organization_id": client_reference_id,
                        "customer_id": stripe_customer_id,
                        "is_premium": True,
                    }
                    new_user = StripeCustomer(**schema_data)

                    t = stripe_service.add(data=new_user, team_id=client_reference_id)

                else: 
                    #update status on existing user that renews subscription
                    stripe_customer:StripeCustomer = stripe_service.get_by_customer_id(stripe_customer_id)

                    stripe_customer.is_premium = True

                    stripe_customer_dict = stripe_customer.__dict__
                    print(type(stripe_customer_dict))
                    print(stripe_customer_dict)

                    stripe_customer_dict.pop("_sa_instance_state", None)
                    # stripe_customer_dict['created_at'] = stripe_customer_dict['created_at'].isoformat()

                    try:
                        t = stripe_service.update(data=stripe_customer_dict, customer_id=stripe_customer.customer_id)
                    except Exception as e:
                        print(e)


            elif event['type'] == 'customer.subscription.deleted':
                
                #update is_premium to false for given user

                subscription = event['data']['object']
                customer_id = subscription.get('customer')

                t = stripe_service.update({"is_premium": True}, stripe_customer)


            else:    
                print('Unhandled event type {}'.format(event['type']))

            return jsonify(success=True)
                
        except ValueError as e:
            # Invalid payload
            logger.error('Failed to parse stripe webhook. ' + str(e))
            return jsonify(success=False)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            logger.warn('⚠️ Stripe webhook signature verification failed.' + str(e))
            return jsonify(success=False)
                
