import sqlalchemy as sa
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import db
from app.models.slack_user_group_association import slack_user_group_association_table


class SlackUser(db.Model):
    __tablename__ = "slack_users"
    slack_id = sa.Column(sa.String, primary_key=True)
    current_username = sa.Column(sa.String, nullable=False)
    first_seen = sa.Column(sa.DateTime(timezone=True), nullable=False, server_default=func.now())
    active = sa.Column(sa.Boolean, nullable=False, server_default='t')
    priority = sa.Column(sa.Integer, nullable=False, server_default='1')
    email = sa.Column(sa.String, nullable=True)
    ratings = relationship("Rating", backref="slack_user", cascade="all, delete-orphan")
    slack_organization_id = sa.Column(sa.String, sa.ForeignKey('slack_organizations.team_id'), nullable=False)
    groups = relationship(
        "Group",
        secondary=slack_user_group_association_table,
        back_populates="members"
    )
    __table_args__ = (
        sa.CheckConstraint(priority >= 1, name='check_priority_range_min'),
        sa.CheckConstraint(priority <= 10, name='check_priority_range_max'),
    )

    def __eq__(self, other):
        if not isinstance(other, SlackUser):
            return False
        return self.slack_id == other.slack_id and self.current_username == other.current_username \
            and self.first_seen == other.first_seen and self.active == other.active and self.priority == other.priority \
            and self.email == other.email and self.slack_organization_id == other.slack_organization_id

    def __repr__(self):
        return "<SlackUsers(id={self.slack_id!r})".format(self=self)
