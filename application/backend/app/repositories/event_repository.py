from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_, not_

from app.db import db
from app.models.event import Event
from app.models.mixins import CrudMixin
from app.models.enums import Age, RSVP
from app.models.restaurant import Restaurant
from app.models.invitation import Invitation
from app.models.slack_organization import SlackOrganization


class EventRepository(Event, CrudMixin):
    @classmethod
    def get(cls, filters, order_by = None, page = None, per_page = None, team_id = None, session=db.session):
        query = session.query(cls)

        if team_id:
            query = query.filter(cls.slack_organization_id == team_id)

        # Add filters to the query
        if 'age' in filters and filters['age'] == Age.New:
            query = query.filter(cls.time > datetime.now())
        elif 'age' in filters and filters['age'] == Age.Old:
            query = query.filter(cls.time < datetime.now())
        # Add order by to the query
        if order_by:
            query = query.order_by(order_by())
        # If pagination is on, paginate the query
        if page and per_page:
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            return pagination.total, pagination.items

        res = query.count(), query.all()
        return res

    @classmethod
    def get_events_in_need_of_invitations(cls, days_in_advance_to_invite, session=db.session):
        query = session.query(cls.id, cls.time, Restaurant.name, SlackOrganization.team_id, SlackOrganization.access_token, cls.people_per_event, func.count(Invitation.event_id).label("invited")) \
            .outerjoin(
            Restaurant,
            cls.restaurant_id == Restaurant.id
        ) \
            .outerjoin(
            SlackOrganization,
            cls.slack_organization_id == SlackOrganization.team_id
        ) \
            .outerjoin(
            Invitation,
            and_(
                Invitation.event_id == cls.id,
                or_(
                    Invitation.rsvp == RSVP.unanswered,
                    Invitation.rsvp == RSVP.attending
                )
            )
        ) \
            .filter(
            and_(
                cls.time > datetime.now(),
                cls.time < (datetime.now() + timedelta(days=days_in_advance_to_invite))
            )
        ) \
            .group_by(cls.id, Restaurant.name, SlackOrganization.team_id, SlackOrganization.access_token) \
            .having(func.count(Invitation.event_id) < cls.people_per_event)
        return query.all()

    @classmethod
    def get_event_by_id_if_ready_to_finalize(cls, event_id, session=db.session):
        query = session.query(cls) \
            .join(Invitation, Invitation.event_id == cls.id) \
            .filter(
            and_(
                and_(
                    Invitation.rsvp == RSVP.attending,
                    not_(cls.finalized)
                ),
                Invitation.event_id == event_id
            )
        ) \
            .group_by(cls.id, cls.time, cls.restaurant_id) \
            .having(func.count(cls.id) == cls.people_per_event)
        return query.first()
