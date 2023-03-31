import pytest
from datetime import datetime, timedelta
from app.services.invitation_service import InvitationService
from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP
import pytz

@pytest.fixture
def event_service_mock(mocker):
    return mocker.MagicMock()

@pytest.fixture
def restaurant_service_mock(mocker):
    return mocker.MagicMock()

@pytest.fixture
def invitation_service(mocker, event_service_mock, restaurant_service_mock):
    logging_mock = mocker.MagicMock()
    return InvitationService(logging_mock, event_service_mock, restaurant_service_mock)


@pytest.mark.usefixtures('client_class')
class TestInvitationServiceSuit:
    def test_add(self, db, slack_organizations, events, slack_users, invitation_service):
        team_id = slack_organizations[0].team_id
        event = events.get(team_id)[0]
        slack_user = slack_users.get(team_id)[0]

        invitation_service.add(event_id=event.id, user_id=slack_user.slack_id)

        assert db.session.get(Invitation, (event.id, slack_user.slack_id)) is not None

    def test_get(self, slack_organizations, invitations, invitation_service):
        team_id = slack_organizations[0].team_id
        invitations = invitations.get(team_id)
        test_invitations = invitation_service.get(filters={}, page=1, per_page=10, team_id=team_id)

        sorted_invitations = sorted(invitations, key=lambda x: (x.event_id, x.slack_id))
        sorted_test_invitations = sorted(test_invitations[1], key=lambda x: (x.event_id, x.slack_id))
        for x,y in zip(sorted_invitations, sorted_test_invitations):
            assert x == y

    def test_get_by_filter(self, slack_organizations, invitations, invitation_service):
        team_id = slack_organizations[0].team_id
        invitations = invitations.get(team_id)
        test_invitations = invitation_service.get_by_filter(key="rsvp", value=RSVP.unanswered, team_id=team_id)

        sorted_invitations = sorted(invitations, key=lambda x: (x.event_id, x.slack_id))
        sorted_test_invitations = sorted(test_invitations, key=lambda x: (x.event_id, x.slack_id))
        for x,y in zip(sorted_invitations, sorted_test_invitations):
            assert x == y

    def test_get_by_id(self, slack_organizations, invitations, invitation_service):
        team_id = slack_organizations[0].team_id
        invitation = invitations.get(team_id)[0]
        test_invitation = invitation_service.get_by_id(id=(invitation.event_id, invitation.slack_id), team_id=team_id)

        assert invitation == test_invitation

    def test_get_unanswered_invitations_on_finished_events_and_set_not_attending(self, db, slack_organizations, slack_users, restaurants, invitation_service):
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_user = slack_users.get(team_id)[0]
        event = Event(
            time=datetime.today() + timedelta(days=-1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id,
            finalized=True
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_user.slack_id
        )
        db.session.add(invitation)
        db.session.commit()

        invitations = invitation_service.get_unanswered_invitations_on_finished_events_and_set_not_attending()
        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        assert len(invitations) == 1
        assert test_invitation.rsvp == RSVP.not_attending

    def test_update_invitation_status_accept(self, mocker, db, mock_broker, slack_organizations, slack_users, restaurants, invitation_service, event_service_mock, restaurant_service_mock):
        # Setup data
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        event = Event(
            time=datetime.today() + timedelta(days=1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation1 = Invitation(
            event_id=event.id,
            slack_id=slack_users[0].slack_id,
            rsvp=RSVP.attending
        )
        invitation2 = Invitation(
            event_id=event.id,
            slack_id=slack_users[1].slack_id
        )
        db.session.add(invitation1)
        db.session.add(invitation2)
        db.session.commit()

        # Setup mock side effects
        def restaurant_service_get_by_id_side_effect(id):
            if id == restaurant.id:
                return restaurant
            return None
        def event_service_get_by_id_side_effect(id):
            if id == event.id:
                return event
            return None
        def finalize_event_if_complete_side_effect(id):
            if id == event.id:
                event.finalized = True
                db.session.commit()
                return True
            return False
        restaurant_get_by_id = mocker.MagicMock()
        event_get_by_id = mocker.MagicMock()
        finalize_event_if_complete = mocker.MagicMock()
        restaurant_get_by_id.side_effect = restaurant_service_get_by_id_side_effect
        event_get_by_id.side_effect = event_service_get_by_id_side_effect
        finalize_event_if_complete.side_effect = finalize_event_if_complete_side_effect
        restaurant_service_mock.get_by_id = restaurant_get_by_id
        event_service_mock.get_by_id = event_get_by_id
        event_service_mock.finalize_event_if_complete = finalize_event_if_complete

        # Action
        invitation_service.update_invitation_status(event_id=invitation2.event_id, user_id=invitation2.slack_id, rsvp=RSVP.attending)

        # Get assert data
        test_invitation = db.session.get(Invitation, (invitation2.event_id, invitation2.slack_id))
        test_event = db.session.get(Event, invitation2.event_id)

        # Assert
        assert test_invitation.rsvp is RSVP.attending
        assert test_event.finalized is True
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 2
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'finalization'
        assert mock_broker.send.call_args_list[1].kwargs['body']['type'] == 'updated_invitation'

    def test_update_invitation_status_decline(self, mocker, db, slack_organizations, slack_users, restaurants, event_service_mock, mock_broker, invitation_service):
        # Setup data
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        event = Event(
            time=datetime.today() + timedelta(days=1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_users[0].slack_id,
            rsvp=RSVP.attending
        )
        db.session.add(invitation)
        db.session.commit()

        # Setup mock side effects
        def event_service_get_by_id_side_effect(id):
            if id == event.id:
                return event
            return None
        event_get_by_id = mocker.MagicMock()
        event_get_by_id.side_effect = event_service_get_by_id_side_effect
        event_service_mock.get_by_id = event_get_by_id

        # Action
        invitation_service.update_invitation_status(event_id=invitation.event_id, user_id=invitation.slack_id, rsvp=RSVP.not_attending)

        # Get assert data
        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        # Assert
        assert test_invitation.rsvp is RSVP.not_attending
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'updated_invitation'

    def test_update_invitation_status_unanswered(self, mocker, db, slack_organizations, slack_users, restaurants, event_service_mock, mock_broker, invitation_service):
        # Setup data
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        event = Event(
            time=datetime.today() + timedelta(days=1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_users[0].slack_id,
            rsvp=RSVP.attending
        )
        db.session.add(invitation)
        db.session.commit()

        # Setup mock side effects
        def event_service_get_by_id_side_effect(id):
            if id == event.id:
                return event
            return None
        event_get_by_id = mocker.MagicMock()
        event_get_by_id.side_effect = event_service_get_by_id_side_effect
        event_service_mock.get_by_id = event_get_by_id

        # Action
        invitation_service.update_invitation_status(event_id=invitation.event_id, user_id=invitation.slack_id, rsvp=RSVP.unanswered)

        # Get assert data
        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        # Assert
        assert test_invitation.rsvp is RSVP.unanswered
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'updated_invitation'

    def test_update_invitation_status_withdraw(self, mocker, db, slack_organizations, slack_users, restaurants, event_service_mock, restaurant_service_mock, mock_broker, invitation_service):
        # Setup data
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        event = Event(
            time=datetime.today() + timedelta(days=1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id,
            finalized=True,
        )
        db.session.add(event)
        db.session.commit()
        invitation1 = Invitation(
            event_id=event.id,
            slack_id=slack_users[0].slack_id,
            rsvp=RSVP.attending
        )
        invitation2 = Invitation(
            event_id=event.id,
            slack_id=slack_users[1].slack_id,
            rsvp=RSVP.attending
        )
        db.session.add(invitation1)
        db.session.add(invitation2)
        db.session.commit()

        # Setup mock side effects
        def restaurant_service_get_by_id_side_effect(id):
            if id == restaurant.id:
                return restaurant
            return None
        def event_service_get_by_id_side_effect(id):
            if id == event.id:
                return event
            return None
        def unfinalize_event_side_effect(id):
            if id == event.id:
                event.finalized = False
                db.session.commit()
                return True
            return False
        restaurant_get_by_id = mocker.MagicMock()
        event_get_by_id = mocker.MagicMock()
        unfinalize_event = mocker.MagicMock()
        restaurant_get_by_id.side_effect = restaurant_service_get_by_id_side_effect
        event_get_by_id.side_effect = event_service_get_by_id_side_effect
        unfinalize_event.side_effect = unfinalize_event_side_effect
        restaurant_service_mock.get_by_id = restaurant_get_by_id
        event_service_mock.get_by_id = event_get_by_id
        event_service_mock.unfinalize_event = unfinalize_event

        # Action
        invitation_service.update_invitation_status(event_id=invitation2.event_id, user_id=invitation2.slack_id, rsvp=RSVP.not_attending)

        # Get assert data
        test_invitation = db.session.get(Invitation, (invitation2.event_id, invitation2.slack_id))
        test_event = db.session.get(Event, invitation2.event_id)

        # Assert
        assert test_invitation.rsvp is RSVP.not_attending
        assert test_event.finalized is False
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 3
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'user_withdrew_after_finalization'
        assert mock_broker.send.call_args_list[1].kwargs['body']['type'] == 'finalization'
        assert mock_broker.send.call_args_list[2].kwargs['body']['type'] == 'updated_invitation'

    def test_update_invitation_status_expired(self, mocker, db, slack_organizations, slack_users, restaurants, event_service_mock, invitation_service):
        # Setup data
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        event = Event(
            time=datetime.today() + timedelta(days=-1),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_users[0].slack_id,
            rsvp=RSVP.attending
        )
        db.session.add(invitation)
        db.session.commit()

        # Setup mock side effects
        def event_service_get_by_id_side_effect(id):
            if id == event.id:
                return event
            return None
        event_get_by_id = mocker.MagicMock()
        event_get_by_id.side_effect = event_service_get_by_id_side_effect
        event_service_mock.get_by_id = event_get_by_id

        # Action
        test_return = invitation_service.update_invitation_status(event_id=invitation.event_id, user_id=invitation.slack_id, rsvp=RSVP.not_attending)
        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        # Assert
        assert test_return is None
        assert test_invitation.rsvp == RSVP.attending

    def test_update_reminded_at(self, db, slack_organizations, invitations, invitation_service):
        team_id = slack_organizations[0].team_id
        invitation = invitations.get(team_id)[0]

        date = datetime.now(pytz.timezone('Europe/Oslo')) + timedelta(days=1)
        invitation_service.update_reminded_at(
            event_id=invitation.event_id,
            slack_id=invitation.slack_id,
            date=date.isoformat()
        )

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))
        assert test_invitation.reminded_at == date

    def test_update_slack_message(self, db, slack_organizations, invitations, invitation_service):
        team_id = slack_organizations[0].team_id
        invitation = invitations.get(team_id)[0]

        invitation_service.update_slack_message(
            event_id=invitation.event_id,
            slack_id=invitation.slack_id,
            channel_id="dontCareChannelId",
            ts="dontCareTs"
        )

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))
        assert test_invitation.slack_message_channel == "dontCareChannelId"
        assert test_invitation.slack_message_ts == "dontCareTs"
