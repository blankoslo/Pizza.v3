import math
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.sql import func, exists
from sqlalchemy.orm import aliased

from app.db import db
from app.models.slack_user import SlackUser
from app.models.mixins import CrudMixin
from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP
from app.models.slack_user_group_association import slack_user_group_association_table


class SlackUserRepository(SlackUser, CrudMixin):
    @classmethod
    def get(cls, filters = None, order_by = None, page = None, per_page = None, team_id = None, session=db.session):
        query = cls.query

        if team_id:
            query = query.filter(cls.slack_organization_id == team_id)

        if filters is None:
            filters = {}
        # Add filters to the query
        for attr, value in filters.items():
            query = query.filter(getattr(cls, attr) == value)
        # Add order by to the query
        if (order_by):
            query = query.order_by(order_by())
        # If pagination is on, paginate the query
        if (page and per_page):
            pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            return pagination.total, pagination.items

        res = query.count(), query.all()
        return res

    @classmethod
    def get_users_to_invite(cls, number_of_users_to_invite, event_id, total_number_of_employees, employees_per_event, session=db.session):
        number_of_events_regarded = math.ceil(total_number_of_employees / employees_per_event)

        AliasInvitation = aliased(Invitation)

        # Get events to be regarded in counting
        subquery_join = session.query(
            Event.id
        ).filter(
            sa.and_(
                Event.time < datetime.now(),
                Event.finalized == True
            )
        ).order_by(
            Event.time.desc()
        ).limit(
            number_of_events_regarded
        )
        # Only get invitations that are connected specified event and given slack_user
        subquery_filter = session.query(
            AliasInvitation
        ).filter(
            sa.and_(
                AliasInvitation.event_id == event_id,
                AliasInvitation.slack_id == cls.slack_id
            )
        )
        # Get valid slack_user ids from slack organization and group if it is specified
        subquery_group = session.query(
            SlackUser.slack_id
        ).distinct().outerjoin(
            slack_user_group_association_table
        ).join(
            Event,
            sa.and_(Event.slack_organization_id == SlackUser.slack_organization_id, Event.id == event_id)
        ).filter(
            sa.or_(
                Event.group_id.is_(None),
                sa.and_(Event.group_id.is_not(None), Event.group_id == slack_user_group_association_table.c.group_id)
            )
        )

        # Main query
        subquery_query_main = session.query(
            cls.slack_id
        ).join(
            Invitation,
            sa.and_(
                cls.slack_id == Invitation.slack_id,
                sa.and_(
                    Invitation.rsvp == RSVP.attending,
                    Invitation.event_id.in_(subquery_join)
                )
            ),
            isouter=True
        ).filter(
            sa.and_(
                ~subquery_filter.exists(),
                cls.active
            )
        ).group_by(
            cls.slack_id
        ).order_by(
            func.count(Invitation.rsvp), func.random()
        ).subquery()

        # Filter out ids that isnt in the specified group if the group isnt null and limit to the number to be invited
        query = session.query(subquery_query_main).filter(subquery_query_main.c.slack_id.in_(subquery_group)).limit(
            number_of_users_to_invite
        )

        return query.all()

    @classmethod
    def get_invited_unanswered_user_ids(cls, session=db.session):
        query = session.query(cls.slack_id) \
            .join(
            Invitation,
            cls.slack_id == Invitation.slack_id
        ) \
            .filter(Invitation.rsvp == RSVP.unanswered) \
            .distinct()
        return query.all()

    @classmethod
    def get_all_users_in_list(cls, user_id_list, team_id, session=db.session):
        return session.query(SlackUser).filter(SlackUser.slack_id.in_(user_id_list))\
            .filter(SlackUser.slack_organization_id == team_id).all()
