import sqlalchemy as sa
from app.db import db


class SlackMessage(db.Model):
    __tablename__ = "slack_messages"
    ts = sa.Column(sa.String, primary_key=True)
    channel_id = sa.Column(sa.String, primary_key=True)

    def __repr__(self):
        return "<SlackMessage(id={self.ts!r}, id={self.channel_id!r})>".format(self=self)
