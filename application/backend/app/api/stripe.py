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
        identity = get_jwt_identity()
        user = UserRepository.get_by_id(identity)
        products = stripe.Price.list(expand=['data.product'])
        return jsonify(products)



@bp.route('/create-checkout-session')
class Stripe(views.MethodView):
    @jwt_required()
    def post(self):
        
        
        team_id = current_user.slack_organization_id
        stripe_service:StripeCustomerService = injector.get(StripeCustomerService)
        stripe_customer: StripeCustomer = stripe_service.get_by_team_id(team_id=team_id)

        if stripe_customer: 
            print(stripe_customer.__dict__)

        try:
            prices = stripe.Price.list(
                expand=['data.product']
            )


            #TODO: fix this (needs to clean the stripe products easiest in the gui)
            pizzabot_premium_ref = [ref for ref in prices if ref["product"]["name"] == "PizzaBot Premium"][0]

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
        logger: logging.Logger = injector.get(logging.Logger)
        stripe_service: StripeCustomerService = injector.get(StripeCustomerService)
        
        def get_event():
            payload = request.data

            # TODO: this is not secure, enforce secret for production
            endpoint_secret = None # injector.get_config('STRIPE_WEBHOOK_SECRET')  

            if endpoint_secret:
                sig_header = request.headers.get('STRIPE_SIGNATURE')
                try:
                    return stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
                except ValueError as e:
                    logger.error(f'Failed to parse Stripe webhook: {e}')
                except stripe.error.SignatureVerificationError as e:
                    logger.warning(f'Stripe webhook signature verification failed: {e}')
            else:
                return json.loads(payload)

            return None

        def handle_session_completed(event):
            session = event['data']['object']
            client_reference_id = session.get('client_reference_id')
            stripe_customer_id = session.get('customer')

            if client_reference_id:
                return create_new_user(client_reference_id, stripe_customer_id)
            else:
                return update_existing_user(stripe_customer_id)

        def create_new_user(client_reference_id, stripe_customer_id):
            new_user = StripeCustomer(
                slack_organization_id=client_reference_id,
                customer_id=stripe_customer_id,
                is_premium=True,
            )
            try:
                stripe_service.add(data=new_user, team_id=client_reference_id)
                logger.info(f'Created new premium user, stripe_customer_id: {stripe_customer_id}')
                return True
            except Exception as e:
                logger.error(f'Error creating new user: {e}')
                return False

        def update_existing_user(stripe_customer_id):
            stripe_customer: StripeCustomer = stripe_service.get_by_customer_id(stripe_customer_id)
            if not stripe_customer:
                logger.error(f'No customer found with ID: {stripe_customer_id}')
                return False
            
            stripe_customer_dict = stripe_customer.__dict__
            stripe_customer_dict["is_premium"] = True
            stripe_customer_dict.pop("_sa_instance_state", None)

            try:
                stripe_service.update(data=stripe_customer_dict, customer_id=stripe_customer.customer_id)
                logger.info(f'Updated user to premium status, stripe_customer_id: {stripe_customer.customer_id}')
                return True
            except Exception as e:
                logger.error(f'Error updating user: {e}')
                return False

        def handle_subscription_deleted(event):
            subscription = event['data']['object']
            customer_id = subscription.get('customer')
            try:
                stripe_service.update({"is_premium": False}, customer_id)
                logger.info(f'Updated user to non-premium status: {customer_id}')
                return True
            except Exception as e:
                logger.error(f'Error updating subscription status: {e}')
                return False


        event = get_event()

        if not event:
            return jsonify({'success': False, 'message': 'Event processing failed'}), 400

        try:
            if event['type'] == 'checkout.session.completed':
                success = handle_session_completed(event)
            elif event['type'] == 'customer.subscription.deleted':
                success = handle_subscription_deleted(event)
            else:
                success = True
                logger.debug(f'Unhandled event type {event["type"]}')

            return jsonify({'success': success}), 200 if success else 500
        
        except Exception as e:
            logger.error(f'Error handling Stripe webhook: {e}')
            return jsonify({'success': False}), 500

