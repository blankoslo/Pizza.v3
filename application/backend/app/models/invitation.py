import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import db
from app.models.enums import RSVP

class Invitation(db.Model):
    __tablename__ = "invitations"
    event_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey('events.id'), primary_key=True)
    slack_id = sa.Column(sa.String, sa.ForeignKey('slack_users.slack_id'), primary_key=True)
    slack_user = relationship("SlackUser", backref = "invitations")
    invited_at = sa.Column(sa.DateTime(timezone=True), nullable=False, server_default=func.now())
    rsvp = sa.Column(sa.Enum(RSVP, values_callable = lambda x: [e.value for e in x]), nullable=False, server_default=RSVP.unanswered)
    reminded_at = sa.Column(sa.DateTime(timezone=True), nullable=False, server_default=func.now())
    slack_message_channel = sa.Column(sa.String, nullable=True)
    slack_message_ts = sa.Column(sa.String, nullable=True)
    slack_message = relationship("SlackMessage", backref="invitation", single_parent=True, foreign_keys=[slack_message_channel, slack_message_ts], cascade="all, delete-orphan")
    __table_args__ = (sa.ForeignKeyConstraint([slack_message_channel, slack_message_ts], ['slack_messages.channel_id', 'slack_messages.ts']), {})

    def __eq__(self, other):
        if not isinstance(other, Invitation):
            return False
        return self.event_id == other.event_id and self.slack_id == other.slack_id \
            and self.invited_at == other.invited_at \
            and self.rsvp == other.rsvp and self.reminded_at == other.reminded_at \
            and self.slack_message_channel == other.slack_message_channel \
            and self.slack_message_ts == other.slack_message_ts

    def __repr__(self):
        return "<Invitation(id={self.event_id!r}, id={self.slack_id!r})>".format(self=self)
