import pytest
import pytz
from datetime import datetime, timedelta
from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP
from app.models.slack_organization import SlackOrganization
from app.services.slack_organization_service import SlackOrganizationService


@pytest.fixture
def mock_injector(mocker, environment_variables):
    injector_mock = mocker.MagicMock()
    mocker.patch('app.services.broker.handlers.action.injector', injector_mock)
    return injector_mock


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.mark.usefixtures('client_class')
class TestActionHandlerSuit:
    def test_withdraw_invitation(self, db, mock_broker, slack_organizations, restaurants, slack_users, rpc_queue):
        event = Event(
            time=datetime.today() + timedelta(days=3),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_users.get(slack_organizations[0].team_id)[0].slack_id
        )

        db.session.add(invitation)
        db.session.commit()

        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "withdraw_invitation",
            "payload": {
                "slack_id": invitation.slack_id,
                "event_id": invitation.event_id
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        mock_broker.sync_send.assert_called()
        assert test_invitation.rsvp == RSVP.not_attending
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}

    def test_invite_multiple_if_needed(self, db, mock_broker, slack_organizations, slack_users, restaurants, rpc_queue):
        slack_organization = slack_organizations[0]
        slack_users = slack_users.get(slack_organization.team_id)
        restaurant = restaurants.get(slack_organizations[0].team_id)[0]
        event = Event(
            time=datetime.now(pytz.timezone('Europe/Oslo')) + timedelta(days=3),
            restaurant_id=restaurant.id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id
        )
        db.session.add(event)
        db.session.commit()

        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "invite_multiple_if_needed",
            "payload": {

            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitations = Invitation.query.all()
        mock_broker.sync_send.assert_called()
        assert len(test_invitations) == 2
        assert len(mock_broker.sync_send.call_args_list) == 1
        mock_broker.sync_send.call_args_list[0].kwargs['body']['events'][0]['event_time'] = \
            mock_broker.sync_send.call_args_list[0].kwargs['body']['events'][0]['event_time'].isoformat()
        mock_broker.sync_send.call_args_list[0].kwargs['body']['events'][0]['invited_users'] = sorted(
            mock_broker.sync_send.call_args_list[0].kwargs['body']['events'][0]['invited_users'],
            key=lambda x: x
        )
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {
            'events': [
                {
                    'event_time': event.time.isoformat(),
                    'event_id': event.id,
                    'restaurant_name': restaurant.name,
                    'team_id': slack_organization.team_id,
                    'bot_token': slack_organization.access_token,
                    'invited_users': [slack_user.slack_id for slack_user in slack_users]
                }
            ]
        }

    def test_deleted_slack_organization_event(self, mocker, mock_injector, mock_broker, slack_organizations, rpc_queue):
        mock_slack_organization_service = mocker.MagicMock()
        def get_mocked_service(bound_class):
            if bound_class == SlackOrganizationService:
                return mock_slack_organization_service
            else:
                return mocker.MagicMock()
        mock_injector.get = mocker.MagicMock(side_effect=get_mocked_service)

        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "deleted_slack_organization_event",
            "payload": {
                "team_id": slack_organizations[0].team_id
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        mock_slack_organization_service.delete.assert_called_once()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] is None

    def test_set_slack_channel(self, db, mock_broker, rpc_queue, slack_organizations):
        slack_organization = slack_organizations[0]
        slack_organization_old_channel_id = slack_organization.channel_id
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "set_slack_channel",
            "payload": {
                "team_id": slack_organization.team_id,
                "channel_id": "newChannelId1"
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_slack_organization = db.session.get(SlackOrganization, slack_organization.team_id)

        assert test_slack_organization.channel_id == "newChannelId1"
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {
            "success": True,
            'old_channel_id': slack_organization_old_channel_id,
        }

