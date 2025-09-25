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

        # Determine relevant events: latest N finalized past events + all future events
        subquery_join_in_past = session.query(
            Event.id
        ).filter(
            sa.and_(
                Event.time < sa.func.now(),
                Event.finalized.is_(True)
            ),
        ).order_by(
            Event.time.desc()
        ).limit(
            number_of_events_regarded
        )

        subquery_join_in_future = session.query(
            Event.id
        ).filter(
            Event.time > sa.func.now(),
        )

        # Exclude users already invited to the specified event
        subquery_filter = session.query(
            AliasInvitation
        ).filter(
            sa.and_(
                AliasInvitation.event_id == event_id,
                AliasInvitation.slack_id == cls.slack_id
            )
        )

        # Group constraint: same org as event and (no group on event OR user in that group)
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

        # Correlated scalar subqueries per user
        considered_event_clause = sa.or_(
            Invitation.event_id.in_(subquery_join_in_future),
            Invitation.event_id.in_(subquery_join_in_past)
        )

        attending_or_unanswered_count_sq = sa.select(
            func.count()
        ).select_from(Invitation).join(
            Event, Invitation.event_id == Event.id
        ).where(
            sa.and_(
                Invitation.slack_id == cls.slack_id,
                Invitation.rsvp.in_([RSVP.attending, RSVP.unanswered]),
                considered_event_clause
            )
        ).correlate(cls).scalar_subquery()


        # Total number of invites (only needs to consider non-attending as this is the only type not counted in the main considered_event_clause constraint)
        rejected_count_sq = sa.select(
            func.count()
        ).select_from(Invitation).join(
            Event, Invitation.event_id == Event.id
        ).where(
            sa.and_(
                Invitation.slack_id == cls.slack_id,
                Invitation.rsvp == RSVP.not_attending,
                considered_event_clause
            )
        ).correlate(cls).scalar_subquery()

        # Build main selectable of users with computed metrics
        query = session.query(
            cls.slack_id.label('slack_id'),
            attending_or_unanswered_count_sq.label('attending_or_unanswered_count'),
            rejected_count_sq.label('rejected_invites_count')
        ).filter(
            sa.and_(
                ~subquery_filter.exists(),
                cls.active,
                cls.slack_id.in_(subquery_group)
            )
        ).order_by(
            # Priority 1: fewer attended events first (most attended last)
            attending_or_unanswered_count_sq.asc(),
            # Priority 2: fewer answered invites (yes/no) first
            rejected_count_sq.asc(),
            # Priority 3: random tiebreaker
            func.random()
        ).limit(number_of_users_to_invite)

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
