import requests
import json
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
    



