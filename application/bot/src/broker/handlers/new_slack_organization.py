from src.broker.handlers import MessageHandler
from src.broker.schemas.new_slack_organization_event import NewSlackOrganizationEventSchema
from src.api.bot_api import BotApi
from src.injector import injector
from src.api.slack_api import SlackApi


@MessageHandler.handle('new_slack_organization_event', NewSlackOrganizationEventSchema)
def new_slack_organization_event(event: dict):
    with injector.get(BotApi) as ba:
        slack_client = SlackApi(token=event['bot_token'])
        ba.welcome(slack_client=slack_client, user_who_installed=event['user_who_installed'])


