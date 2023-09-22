from app.services.broker.handlers.message_handler import MessageHandler

from app.services.broker.schemas.get_unanswered_invitations import GetUnansweredInvitationsResponseSchema, GetUnansweredInvitationsDataSchema
from app.services.broker.schemas.get_invited_unanswered_user_ids import GetInvitedUnansweredUserIdsResponseSchema
from app.services.broker.schemas.get_scheduled_events_for_user import GetScheduledEventsForUserRequestSchema, GetScheduledEventsForUserResponseSchema
from app.services.broker.schemas.get_slack_installation import GetSlackInstallationRequestSchema, GetSlackInstallationResponseSchema
from app.services.broker.schemas.get_slack_organizations import GetSlackOrganizationsResponseSchema

from app.services.invitation_service import InvitationService
from app.services.slack_organization_service import SlackOrganizationService
from app.services.slack_user_service import SlackUserService
from app.services.event_service import EventService
from app.services.injector import injector

from app.models.enums import RSVP


@MessageHandler.handle('get_unanswered_invitations', outgoing_schema = GetUnansweredInvitationsResponseSchema)
def get_unanswered_invitations():
    invitation_service = injector.get(InvitationService)

    invitations = invitation_service.get_by_filter("rsvp", RSVP.unanswered)
    response_data = []
    for invitation in invitations:
        data = {
            "slack_id": invitation.slack_id,
            "event_id": invitation.event_id,
            "invited_at": invitation.invited_at.isoformat(),
            "reminded_at": invitation.reminded_at.isoformat(),
            'team_id': invitation.event.slack_organization.team_id,
            'bot_token': invitation.event.slack_organization.access_token
        }
        if invitation.slack_message:
            data["slack_message"] = {
                "ts": invitation.slack_message.ts,
                "channel_id": invitation.slack_message.channel_id
            }
        response_data.append(data)

    return {'invitations': response_data}


@MessageHandler.handle('get_unanswered_invitations_on_finished_events_and_set_not_attending', outgoing_schema = GetUnansweredInvitationsResponseSchema)
def get_unanswered_invitations_on_finished_events_and_set_not_attending():
    invitation_service = injector.get(InvitationService)

    invitations = invitation_service.get_unanswered_invitations_on_finished_events_and_set_not_attending()
    response_data = []
    for invitation in invitations:
        data = {
            "slack_id": invitation.slack_id,
            "event_id": invitation.event_id,
            "invited_at": invitation.invited_at.isoformat(),
            "reminded_at": invitation.reminded_at.isoformat(),
            "team_id": invitation.event.slack_organization.team_id,
            "bot_token": invitation.event.slack_organization.access_token
        }
        if invitation.slack_message:
            data["slack_message"] = {
                "ts": invitation.slack_message.ts,
                "channel_id": invitation.slack_message.channel_id
            }
        response_data.append(data)

    return {'invitations': response_data}


@MessageHandler.handle('get_invited_unanswered_user_ids', outgoing_schema = GetInvitedUnansweredUserIdsResponseSchema)
def get_invited_unanswered_user_ids():
    slack_user_service = injector.get(SlackUserService)
    user_ids = slack_user_service.get_invited_unanswered_user_ids()
    response_data = [user_id[0] for user_id in user_ids]

    return {'user_ids': response_data}

@MessageHandler.handle('get_scheduled_events_for_user', incoming_schema=GetScheduledEventsForUserRequestSchema, outgoing_schema = GetScheduledEventsForUserResponseSchema)
def get_scheduled_events_for_user(request: dict):
    event_service = injector.get(EventService)
    events = event_service.get_scheduled_events_for_user(request['user_id'], request['team_id'])
    response_data = []
    for event in events:
        data = {
            "event_id": event.id,
            "restaurant_id": event.restaurant_id,
            "time": event.time.isoformat(),
            "responded": event.rsvp,
            "event_finalized": event.finalized,
            "slack_message_channel": event.slack_message_channel,
            "slack_message_ts": event.slack_message_ts,
        }
        response_data.append(data)

    return {'events': response_data}


@MessageHandler.handle('get_slack_installation', incoming_schema = GetSlackInstallationRequestSchema, outgoing_schema = GetSlackInstallationResponseSchema)
def get_slack_installation(request: dict):
    slack_organization_service = injector.get(SlackOrganizationService)
    slack_organization = slack_organization_service.get_by_id(request['team_id'])

    response = {
        'team_id': slack_organization.team_id,
        'app_id': slack_organization.app_id,
        'bot_user_id': slack_organization.bot_user_id,
        'access_token': slack_organization.access_token,
        'channel_id': slack_organization.channel_id,
    }

    if slack_organization.team_name:
        response['team_name'] = slack_organization.team_name
    if slack_organization.enterprise_id:
        response['enterprise_id'] = slack_organization.enterprise_id
    if slack_organization.enterprise_name:
        response['enterprise_name'] = slack_organization.enterprise_name
    return response


@MessageHandler.handle('get_slack_organizations', outgoing_schema = GetSlackOrganizationsResponseSchema)
def get_slack_organizations():
    slack_organization_service = injector.get(SlackOrganizationService)
    count, slack_organizations = slack_organization_service.get()
    response_data = [{
        'team_id': slack_organization.team_id,
        'bot_token': slack_organization.access_token
    } for slack_organization in slack_organizations]

    return {'organizations': response_data}
