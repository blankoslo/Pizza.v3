import pytest
from datetime import datetime, timedelta
from app.services.event_service import EventService
from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP
import pytz

@pytest.fixture
def event_service():
    return EventService()


@pytest.mark.usefixtures('client_class')
class TestEventServiceSuit:
    def test_get_events_in_need_of_invitations(self, db, slack_organizations, restaurants, event_service):
        event = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=5,
            slack_organization_id=slack_organizations[0].team_id
        )
        db.session.add(event)
        db.session.commit()

        events_in_need_of_invitations = event_service.get_events_in_need_of_invitations()
        assert len(events_in_need_of_invitations) == 1
        assert events_in_need_of_invitations[0][0] == event.id

    def test_finalize_event_if_complete(self, db, slack_organizations, restaurants, slack_users, event_service):
        event1 = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id
        )
        event2 = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id
        )
        db.session.add(event1)
        db.session.add(event2)
        db.session.commit()
        invitation1 = Invitation(
            event_id=event1.id,
            slack_id=slack_users.get(slack_organizations[0].team_id)[0].slack_id,
            rsvp=RSVP.attending
        )
        invitation2 = Invitation(
            event_id=event1.id,
            slack_id=slack_users.get(slack_organizations[0].team_id)[1].slack_id,
            rsvp=RSVP.attending
        )
        db.session.add(invitation1)
        db.session.add(invitation2)
        db.session.commit()

        event_service.finalize_event_if_complete(event1.id)
        event_service.finalize_event_if_complete(event2.id)

        assert db.session.get(Event, event1.id).finalized is True
        assert db.session.get(Event, event2.id).finalized is False

    def test_unfinalize_event(self, db, slack_organizations, restaurants, event_service):
        event1 = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id,
            finalized=True
        )
        db.session.add(event1)
        db.session.commit()

        event_service.unfinalize_event(event1.id)

        assert db.session.get(Event, event1.id).finalized is False

    def test_get(self, slack_organizations, events, event_service):
        team_id = slack_organizations[0].team_id
        events = events.get(team_id)
        test_events = event_service.get(filters={}, page=1, per_page=10, team_id=team_id)

        sorted_events = sorted(events, key=lambda x: x.id)
        sorted_test_events = sorted(test_events[1], key=lambda x: x.id)
        for x,y in zip(sorted_events, sorted_test_events):
            assert x == y

    def test_get_by_id(self, slack_organizations, events, event_service):
        team_id = slack_organizations[0].team_id
        event = events.get(team_id)[0]
        test_event = event_service.get_by_id(event_id=event.id, team_id=team_id)
        assert event == test_event

    def test_delete(self, db, slack_organizations, events, event_service, mock_broker):
        team_id = slack_organizations[0].team_id
        event = events.get(team_id)[0]
        event_service.delete(event_id=event.id, team_id=team_id)
        test_event = db.session.get(Event, event.id)

        assert test_event is None
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'deleted_event'

    def test_add(self, slack_organizations, restaurants, groups, event_service):
        team_id = slack_organizations[0].team_id
        group = groups.get(team_id)[0]

        data = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            group_id=group.id
        )
        event_service.add(data=data, team_id=team_id)

        test_events = Event.query.all()
        assert len(test_events) == 1

    def test_update(self, db, slack_organizations, events, groups, restaurants, mock_broker, event_service):
        team_id = slack_organizations[0].team_id
        event = events.get(team_id)[0]
        group = groups.get(team_id)[0]
        restaurant = restaurants.get(team_id)[0]

        date = datetime.now(pytz.timezone('Europe/Oslo')) + timedelta(days=5)

        event_service.update(
            event_id=event.id,
            data={
                'people_per_event': 8,
                'time': date,
                'restaurant_id': restaurant.id,
                'group_id': group.id
            },
            team_id=team_id
        )

        updated_event = db.session.get(Event, event.id)
        assert updated_event.people_per_event == 8
        assert updated_event.time == date
        assert updated_event.restaurant_id == restaurant.id
        assert updated_event.group_id == group.id
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'updated_event'
