import logging

from app.services.broker.handlers.message_handler import MessageHandler
from app.services.broker.schemas.update_invitation import UpdateInvitationRequestSchema, UpdateInvitationResponseSchema
from app.services.broker.schemas.update_slack_user import UpdateSlackUserRequestSchema, UpdateSlackUserResponseSchema

from app.services.injector import injector
from app.services.invitation_service import InvitationService
from app.services.slack_user_service import SlackUserService


@MessageHandler.handle('update_invitation', UpdateInvitationRequestSchema, UpdateInvitationResponseSchema)
def update_invitation(request: dict):
    logger = injector.get(logging.Logger)
    invitation_service = injector.get(InvitationService)
    slack_id = request.get('slack_id')
    event_id = request.get('event_id')
    update_data = request.get('update_data')

    # TODO: Refactor this into one update so that it is transactional

    result = False
    if "reminded_at" in update_data:
        response = invitation_service.update_reminded_at(event_id, slack_id, update_data["reminded_at"].isoformat())
        result = True if response is not None else False
        logger.info("Updated reminded_at for (%s,%s)", event_id, slack_id)

    # Update invitation to either accepted or declined
    if 'rsvp' in update_data:
        response = invitation_service.update_invitation_status(event_id, slack_id, update_data["rsvp"])
        result = True if response is not None else False
        logger.info("Updated rsvp for (%s,%s)", event_id, slack_id)

    if 'slack_message' in update_data:
        response = invitation_service.update_slack_message(event_id, slack_id, update_data["slack_message"]['ts'], update_data["slack_message"]['channel_id'])
        result = True if response is not None else False
        logger.info("Updated invitation slack message for (%s,%s)", event_id, slack_id)

    return {'success': result}


@MessageHandler.handle('update_slack_user', UpdateSlackUserRequestSchema, UpdateSlackUserResponseSchema)
def update_slack_user(request: dict):
    logger = injector.get(logging.Logger)
    slack_user_service = injector.get(SlackUserService)
    users_to_update = request['users_to_update']

    success = True
    updated_users = []
    failed_users = []
    for user in users_to_update:
        try:
            to_update = {}
            if 'current_username' in user:
                to_update['current_username'] = user['current_username']
            if 'email' in user:
                to_update['email'] = user['email']
            if 'active' in user:
                to_update['active'] = user['active']
            result = slack_user_service.update(user['slack_id'], to_update, user['team_id'])

            # if user doesnt exist, so add them
            if result is None:
                slack_user_service.add({
                    'slack_id': user['slack_id'],
                    'current_username': user['current_username'],
                    'email': user['email']
                }, user['team_id'])
            updated_users.append(user['slack_id'])
            
        except Exception as e:
            logger.warning(e)
            success = False
            failed_users.append(user['slack_id'])

    return {
        'success': success,
        'updated_users': updated_users,
        'failed_users': failed_users
    }
