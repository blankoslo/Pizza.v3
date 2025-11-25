import requests
import json
import logging
from flask import views, request, redirect, jsonify, current_app
from flask_smorest import Blueprint, abort
from app.repositories.user_repository import UserRepository
from app.models.user_schema import UserSchema
from app.auth import auth
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from app.services.slack_organization_service import SlackOrganizationService
from app.services.injector import injector
import stripe

bp = Blueprint("stripe", "stripe", url_prefix="/stripe", description="Stripe payments")

@bp.route("/products")
class Stripe(views.MethodView):
    #@jwt_required()
    def get(self):
        # identity = get_jwt_identity()
        # user = UserRepository.get_by_id(identity)
        products = stripe.Price.list(expand=['data.product'])
        return jsonify(products)


@bp.route('/create-checkout-session')
class Stripe(views.MethodView):
    def post(self):
        try:
            prices = stripe.Price.list(
                expand=['data.product']
            )
            # print(prices)

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': prices.data[0].id,
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
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                print(payment_intent)

            # ... handle other event types
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
                
