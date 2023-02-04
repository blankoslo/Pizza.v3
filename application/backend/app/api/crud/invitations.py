from flask import views
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from app.models.invitation_schema import InvitationSchema, InvitationUpdateSchema, InvitationQueryArgsSchema
from app.services.injector import injector
from app.services.invitation_service import InvitationService

bp = Blueprint("invitations", "invitations", url_prefix="/invitations", description="Operations on invitations")

@bp.route("/")
class Invitations(views.MethodView):
    @bp.arguments(InvitationQueryArgsSchema, location="query")
    @bp.response(200, InvitationSchema(many=True))
    @bp.paginate()
    def get(self, args, pagination_parameters):
        """List invitations"""
        invitation_service = injector.get(InvitationService)
        total, invitations = invitation_service.get(args, pagination_parameters.page, pagination_parameters.page_size)
        pagination_parameters.item_count = total
        return invitations

@bp.route("/<event_id>")
class InvitationsById(views.MethodView):
    @bp.response(200, InvitationSchema(many=True))
    def get(self, event_id):
        """Get invitation by ID"""
        invitation_service = injector.get(InvitationService)
        return invitation_service.get_by_filter("event_id", event_id)

@bp.route("/<event_id>/<user_id>")
class InvitationsById(views.MethodView):
    @bp.response(200, InvitationSchema)
    def get(self, event_id, user_id):
        """Get invitation by ID"""
        invitation_service = injector.get(InvitationService)
        invitation = invitation_service.get_by_id((event_id, user_id))
        if invitation is None:
            abort(404, message = "Invitation not found.")
        return invitation
    
    @bp.arguments(InvitationUpdateSchema)
    @bp.response(200, InvitationSchema)
    @jwt_required()
    def put(self, update_data, event_id, user_id):
        """Update existing invitation"""
        invitation_service = injector.get(InvitationService)
        updated_invitation = invitation_service.update_invitation_status(event_id, user_id, update_data['rsvp'])
        if updated_invitation is None:
            abort(422, message = "Invitation not found.")
        return updated_invitation
