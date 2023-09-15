from datetime import datetime

from app.db import db

from app.models.slack_organization import SlackOrganization
from app.models.event import Event
from app.models.mixins import CrudMixin

class SlackOrganizationRepository(SlackOrganization, CrudMixin):
    @classmethod
    def get_scheduled_events(cls, team_id = None, session=db.session):
        query = session.query(cls.team_id, Event.id, Event.time) \
            .outerjoin(
                Event,
                cls.team_id == Event.slack_organization_id
            ) \
            .filter(
                team_id == cls.team_id if team_id is not None else True,
                Event.time > datetime.now()
            )

        res = query.count(), query.all()
        return res
