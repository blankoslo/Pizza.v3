import pytest
from app.models.image import Image


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.mark.usefixtures('client_class')
class TestCreateHandlerSuit:
    def test_withdraw_invitation(self, db, slack_organizations, slack_users, mock_broker, rpc_queue):
        team_id = slack_organizations[0].team_id
        slack_user = slack_users.get(team_id)[0]
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "create_image",
            "payload": {
                "cloudinary_id": "dontCareNewCloudinaryId",
                "title": "dontCareTitle",
                "slack_id": slack_user.slack_id,
                "team_id": team_id
            }
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        test_image = db.session.get(Image, "dontCareNewCloudinaryId")

        mock_broker.sync_send.assert_called()
        assert test_image is not None
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == {'success': True}
