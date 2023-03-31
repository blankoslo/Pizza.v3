import sqlalchemy as sa
from sqlalchemy.orm import relationship
from app.db import db


class SlackOrganization(db.Model):
    __tablename__ = "slack_organizations"
    team_id = sa.Column(sa.String, primary_key=True)
    team_name = sa.Column(sa.String, nullable=True)
    enterprise_id = sa.Column(sa.String, nullable=True)
    enterprise_name = sa.Column(sa.String, nullable=True)
    app_id = sa.Column(sa.String, nullable=False)
    bot_user_id = sa.Column(sa.String, nullable=False)
    access_token = sa.Column(sa.String, nullable=False)
    channel_id = sa.Column(sa.String, nullable=True)
    slack_users = relationship("SlackUser", backref="slack_organization", cascade="all, delete-orphan")
    users = relationship("User", backref="slack_organization", cascade="all, delete-orphan")
    events = relationship("Event", backref="slack_organization", cascade="all, delete-orphan")
    images = relationship("Image", backref="slack_organization", cascade="all, delete-orphan")
    restaurants = relationship("Restaurant", backref="slack_organization", cascade="all, delete-orphan")
    groups = relationship("Group", backref="slack_organization", cascade="all, delete-orphan")

    def __eq__(self, other):
        if not isinstance(other, SlackOrganization):
            return False
        return self.team_id == other.team_id and self.team_name == other.team_name \
            and self.enterprise_id == other.enterprise_id and self.enterprise_name == other.enterprise_name \
            and self.app_id == other.app_id and self.bot_user_id == other.bot_user_id \
            and self.access_token == other.access_token and self.channel_id == other.channel_id


