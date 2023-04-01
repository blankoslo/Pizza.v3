import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db import db


class Event(db.Model):
    __tablename__ = "events"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()"))
    time = sa.Column(sa.DateTime(timezone=True), nullable=False)
    restaurant_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey('restaurants.id'), nullable=False)
    restaurant = relationship("Restaurant", backref = "events", uselist=False)
    finalized = sa.Column(sa.Boolean, nullable=False, server_default='f')
    invitations = relationship("Invitation", backref="event", cascade="all, delete-orphan")
    slack_organization_id = sa.Column(sa.String, sa.ForeignKey('slack_organizations.team_id'), nullable=False)
    people_per_event = sa.Column(sa.Integer, nullable=False, server_default=sa.text("5"))
    group_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey('groups.id', ondelete='SET NULL'), nullable=True)
    group = relationship("Group", uselist=False)
    __table_args__ = (
        sa.CheckConstraint(people_per_event >= 2, name='check_people_per_event_min'),
        sa.CheckConstraint(people_per_event <= 100, name='check_people_per_event_max'),
    )

    def __eq__(self, other):
        if not isinstance(other, Event):
            return False
        return self.id == other.id and self.time == other.time and self.restaurant_id == other.restaurant_id \
            and self.finalized == other.finalized and self.slack_organization_id == other.slack_organization_id \
            and self.people_per_event == other.people_per_event and self.group_id == other.group_id

    def __repr__(self):
        return "<Event(id={self.id!r})>".format(self=self)
