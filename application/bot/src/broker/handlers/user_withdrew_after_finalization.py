from src.broker.handlers import MessageHandler
from src.broker.schemas.user_withdrew_after_finalization_event import UserWithdrewAfterFinalizationEventSchema
from src.api.bot_api import BotApi
from src.injector import injector

@MessageHandler.handle('user_withdrew_after_finalization', UserWithdrewAfterFinalizationEventSchema)
def withdraw_invitation(event: dict):
    with injector.get(BotApi) as ba:
        ba.send_user_withdrew_after_finalization(event['slack_id'], event['timestamp'], event['restaurant_name'])
