import pytest
import pytz
from app.models.invitation import Invitation
from app.models.enums import RSVP
from datetime import datetime


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.mark.usefixtures('client_class')
class TestUpdateHandlerSuit:
    def test_update_invitation(self, db, slack_organizations, invitations, mock_broker, rpc_queue):
        invitation = invitations.get(slack_organizations[0].team_id)[0]
        reminded_at = datetime.now().astimezone().isoformat()
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "update_invitation",
            "payload": {
                "slack_id": invitation.slack_id,
                "event_id": invitation.event_id,
                "update_data": {
                    "reminded_at": reminded_at,
                    "rsvp": RSVP.not_attending,
                    "slack_message": {
                        "ts": "dontCareNewTs",
                        "channel_id": "dontCareNewChannelId"
                    }
                }
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        mock_broker.sync_send.assert_called()
        assert test_invitation.reminded_at.isoformat() == reminded_at
        assert test_invitation.rsvp == RSVP.not_attending
        assert test_invitation.slack_message.ts == "dontCareNewTs"
        assert test_invitation.slack_message.channel_id == "dontCareNewChannelId"
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}

    def test_update_invitation_reminded_at(self, db, slack_organizations, invitations, mock_broker, rpc_queue):
        invitation = invitations.get(slack_organizations[0].team_id)[0]
        reminded_at = datetime.now().astimezone().isoformat()
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "update_invitation",
            "payload": {
                "slack_id": invitation.slack_id,
                "event_id": invitation.event_id,
                "update_data": {
                    "reminded_at": reminded_at,
                }
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        mock_broker.sync_send.assert_called()
        assert test_invitation.reminded_at.isoformat() == reminded_at
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}

    def test_update_invitation_rsvp(self, db, slack_organizations, invitations, mock_broker, rpc_queue):
        invitation = invitations.get(slack_organizations[0].team_id)[0]
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "update_invitation",
            "payload": {
                "slack_id": invitation.slack_id,
                "event_id": invitation.event_id,
                "update_data": {
                    "rsvp": RSVP.not_attending,
                }
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        mock_broker.sync_send.assert_called()
        assert test_invitation.rsvp == RSVP.not_attending
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}

    def test_update_invitation_slack_message(self, db, slack_organizations, invitations, mock_broker, rpc_queue):
        invitation = invitations.get(slack_organizations[0].team_id)[0]
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "update_invitation",
            "payload": {
                "slack_id": invitation.slack_id,
                "event_id": invitation.event_id,
                "update_data": {
                    "slack_message": {
                        "ts": "dontCareNewTs",
                        "channel_id": "dontCareNewChannelId"
                    }
                }
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_invitation = db.session.get(Invitation, (invitation.event_id, invitation.slack_id))

        mock_broker.sync_send.assert_called()
        assert test_invitation.slack_message.ts == "dontCareNewTs"
        assert test_invitation.slack_message.channel_id == "dontCareNewChannelId"
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}

    def test_update_slack_user(self, slack_organizations, slack_users, mock_broker, rpc_queue):
        team_id = slack_organizations[0].team_id
        slack_user1 = slack_users.get(team_id)[0]
        slack_user2 = slack_users.get(team_id)[1]
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "update_slack_user",
            "payload": {
                'users_to_update': [
                    {
                        "slack_id": slack_user1.slack_id,
                        "current_username": "newUsername1",
                        "email": slack_user1.email,
                        "team_id": slack_user1.slack_organization_id,
                    },
                    {
                        "slack_id": slack_user2.slack_id,
                        "current_username": "newUsername2",
                        "email": slack_user2.email,
                        "team_id": slack_user2.slack_organization_id,
                    }
                ]
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        user_ids = sorted([slack_user1.slack_id, slack_user2.slack_id], key=lambda x: x)
        mock_updated_users = sorted(
            mock_broker.sync_send.call_args_list[0].kwargs['body']['updated_users'],
            key=lambda x: x
        )
        mock_failed_users = sorted(
            mock_broker.sync_send.call_args_list[0].kwargs['body']['failed_users'],
            key=lambda x: x
        )

        mock_broker.sync_send.assert_called()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert set(mock_broker.sync_send.call_args_list[0].kwargs['body'].keys()) == set(['success', 'updated_users', 'failed_users'])
        assert mock_broker.sync_send.call_args_list[0].kwargs['body']['success'] is True
        assert mock_updated_users == user_ids
        assert mock_failed_users == []
