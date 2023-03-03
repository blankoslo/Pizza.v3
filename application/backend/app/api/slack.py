import requests
import os
from flask import views, request, redirect, jsonify, current_app, Response
from flask_smorest import Blueprint, abort
from app.models.slack_organization_schema import SlackOrganizationSchema
from app.models.slack_organization import SlackOrganization


bp = Blueprint("slack", "slack", url_prefix="/slack", description="Slack OAUTH API")

@bp.route("/install")
class Slack(views.MethodView):
    def get(self):
        scopes = [
            'app_mentions:read',
            'channels:history',
            'chat:write',
            'files:read',
            'im:history',
            'im:write',
            'users:read',
            'users:read.email'
        ]
        frontend_base_url = os.environ.get("FRONTEND_URI").rstrip('/')
        callback_redirect_uri = f'{frontend_base_url}/slack/callback'
        client_id = current_app.config["slack_client_id"]
        if client_id == None:
            return abort(500)
        base_redirect_url = "https://slack.com/oauth/v2/authorize"
        redirect_url = f'{base_redirect_url}?scope={",".join(scopes)}&client_id={client_id}&redirect_uri={callback_redirect_uri}'
        return jsonify(redirect_url=redirect_url)

@bp.route("/callback")
class Slack(views.MethodView):
    def post(self):
        url = "https://slack.com/api/oauth.v2.access"

        code = request.json.get('code')
        client_id = current_app.config["SLACK_CLIENT_ID"]
        client_secret = current_app.config["SLACK_SECRET"]
        if code is None:
            return abort(400)
        if client_id is None or client_secret is None:
            return abort(500)

        data = {
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret
        }

        response = requests.post(url, data=data).json()

        if not response['ok']:
            return abort(500)

        schema = SlackOrganizationSchema()
        slack_organization = schema.load(response)
        SlackOrganization.upsert(slack_organization)

        return Response(status=200)
