import pytest
from functools import reduce
from datetime import datetime, timedelta
from app.models.event import Event
from app.models.invitation import Invitation
from app.models.enums import RSVP


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.mark.usefixtures('client_class')
class TestGetHandlerSuit:
    def test_get_unanswered_invitations(self, invitations, mock_broker, rpc_queue):
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "get_unanswered_invitations"
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        invitations = reduce(lambda x, y: x + y, invitations.values())

        mock_broker.sync_send.assert_called()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'invitations': [{
            "slack_id": invitation.slack_id,
            "event_id": invitation.event_id,
            "invited_at": invitation.invited_at,
            "reminded_at": invitation.reminded_at,
            'team_id': invitation.event.slack_organization.team_id,
            'bot_token': invitation.event.slack_organization.access_token
        } for invitation in invitations]}

    def test_get_unanswered_invitations_on_finished_events_and_set_not_attending(self, mock_broker, db, slack_organizations, slack_users, restaurants, rpc_queue):
        event = Event(
            time=datetime.today() + timedelta(days=-1),
            restaurant_id=restaurants.get(slack_organizations[0].team_id)[0].id,
            people_per_event=2,
            slack_organization_id=slack_organizations[0].team_id
        )
        db.session.add(event)
        db.session.commit()
        invitation = Invitation(
            event_id=event.id,
            slack_id=slack_users.get(slack_organizations[0].team_id)[0].slack_id,
        )
        db.session.add(invitation)
        db.session.commit()

        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "get_unanswered_invitations_on_finished_events_and_set_not_attending"
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        mock_broker.sync_send.assert_called()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'invitations': [{
            "slack_id": invitation.slack_id,
            "event_id": invitation.event_id,
            "invited_at": invitation.invited_at,
            "reminded_at": invitation.reminded_at,
            'team_id': invitation.event.slack_organization.team_id,
            'bot_token': invitation.event.slack_organization.access_token
        }]}

    def test_get_invited_unanswered_user_ids(self, mock_broker, invitations, rpc_queue):
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "get_invited_unanswered_user_ids"
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        ids = sorted(
            list(set(map(lambda x: x.slack_id, reduce(lambda x, y: x + y, invitations.values())))),
            key=lambda x: x
        )
        mock_ids = sorted(
            mock_broker.sync_send.call_args_list[0].kwargs['body']['user_ids'],
            key=lambda x: x
        )

        mock_broker.sync_send.assert_called()
        assert set(mock_broker.sync_send.call_args_list[0].kwargs['body'].keys()) == set(['user_ids'])
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_ids == ids

    def test_get_slack_installation(self, mock_broker, slack_organizations, rpc_queue):
        slack_organization = slack_organizations[0]
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "get_slack_installation",
            "payload": {
                "team_id": slack_organizations[0].team_id
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        mock_broker.sync_send.assert_called()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {
            'team_id': slack_organization.team_id,
            'app_id': slack_organization.app_id,
            'bot_user_id': slack_organization.bot_user_id,
            'access_token': slack_organization.access_token
        }

    def test_get_slack_organizations(self, mock_broker, slack_organizations, rpc_queue):
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "get_slack_organizations"
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        slack_organizations = sorted(
            list(
                map(
                    lambda x: {'team_id': x.team_id, 'bot_token': x.access_token},
                    slack_organizations
                )
            ),
            key=lambda x: x['team_id']
        )
        mock_slack_organizations = sorted(
            mock_broker.sync_send.call_args_list[0].kwargs['body']['organizations'],
            key=lambda x: x['team_id']
        )

        mock_broker.sync_send.assert_called()
        assert set(mock_broker.sync_send.call_args_list[0].kwargs['body'].keys()) == set(['organizations'])
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_slack_organizations == slack_organizations
