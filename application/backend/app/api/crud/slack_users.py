import requests
from flask import jsonify, views
from flask_smorest import Blueprint, abort
from app.models.slack_user_schema import SlackUserResponseSchema, SlackUserUpdateSchema, SlackUserQueryArgsSchema
from flask_jwt_extended import jwt_required, current_user
from app.services.injector import injector
from app.services.slack_user_service import SlackUserService
from app.services.slack_organization_service import SlackOrganizationService

bp = Blueprint("users", "users", url_prefix="/users", description="Operations on users")

@bp.route("/")
class SlackUsers(views.MethodView):
    @bp.arguments(SlackUserQueryArgsSchema, location="query")
    @bp.response(200, SlackUserResponseSchema(many=True))
    @bp.paginate()
    @jwt_required()
    def get(self, args, pagination_parameters):
        """List slack_users"""
        slack_user_service = injector.get(SlackUserService)
        total, slack_users = slack_user_service.get(filters=args, page=pagination_parameters.page, per_page=pagination_parameters.page_size, order_by_ascending=True, team_id=current_user.slack_organization_id)
        pagination_parameters.item_count = total
        return slack_users
    
@bp.route("/current-channel")
class SlackChannel(views.MethodView):
    @jwt_required()
    def get(self):
        """Get current channel info"""
        slack_organization = injector.get(SlackOrganizationService)
        org = slack_organization.get_by_id(team_id=current_user.slack_organization_id)
        channel_id = org.channel_id

        if channel_id is None:
            return jsonify({"channel_name": None, "users": [] })

        request_url = f'https://slack.com/api/conversations.info?channel={channel_id}'
        res = requests.post(request_url, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {org.access_token}"
        }).json()
        
        if not res["ok"]:
            abort(500, message = "Error getting channel info")

        channel_name = res["channel"]["name"]

        slack_user_service = injector.get(SlackUserService)
        count, slack_users = slack_user_service.get(filters={"slack_organization_id": current_user.slack_organization_id})
        returned_users = [
            {
                "slack_id": user.slack_id,
                "current_username": user.current_username,
                "active": user.active,
                "priority": user.priority,
                "email": user.email,
                "first_seen": user.first_seen,
            } for user in slack_users
        ]
    
        return jsonify({"channel_name": channel_name, "users": returned_users })

@bp.route("/<slack_user_id>")
class SlackUsersById(views.MethodView):
    @bp.response(200, SlackUserResponseSchema)
    @jwt_required()
    def get(self, slack_user_id):
        """Get slack_user by ID"""
        slack_user_service = injector.get(SlackUserService)
        slack_user = slack_user_service.get_by_id(slack_user_id=slack_user_id, team_id=current_user.slack_organization_id)
        if slack_user is None:
            abort(404, message = "User not found.")
        return slack_user

    @bp.arguments(SlackUserUpdateSchema)
    @bp.response(200, SlackUserResponseSchema)
    @jwt_required()
    def put(self, update_data, slack_user_id):
        """Update existing user"""
        slack_user_service = injector.get(SlackUserService)
        updated_slack_user = slack_user_service.update(slack_user_id=slack_user_id, data=update_data, team_id=current_user.slack_organization_id)
        if updated_slack_user is None:
            abort(404, message = "User not found.")
        return updated_slack_user
