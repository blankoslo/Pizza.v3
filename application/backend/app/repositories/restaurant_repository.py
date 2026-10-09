from sqlalchemy import func, and_, not_

from app.models.mixins import CrudMixin
from app.models.restaurant import Restaurant
from app.models.event import Event
from app.db import db

class RestaurantRepository(Restaurant, CrudMixin):
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
    def get_least_visited(cls, team_id, start, end, session=db.session):
        visits = func.count(Event.id)
        query = session.query(cls) \
            .outerjoin(
            Event,
            and_(
                Event.restaurant_id == cls.id,
                Event.time >= start,
                Event.time < end
            )
        ) \
            .filter(
            and_(
                cls.slack_organization_id == team_id,
                not_(cls.deleted)
            )
        ) \
            .group_by(cls.id) \
            .order_by(
            # Priority 1: fewest events in the period, so no restaurant repeats before all have been visited
            visits.asc(),
            # Priority 2: random tiebreaker
            func.random()
        )
        return query.first()
