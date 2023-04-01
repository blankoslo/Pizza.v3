from app.models.mixins import CrudMixin
from app.models.slack_message import SlackMessage


class SlackMessageRepository(SlackMessage, CrudMixin):
    pass
