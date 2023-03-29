import pytest
from app.services.broker import BrokerService

@pytest.fixture
def broker_service():
    return BrokerService()


@pytest.mark.usefixtures('client_class')
class TestBrokerServiceSuit:
    def test_respond(self, mock_broker, broker_service):
        broker_service.respond("response_1", "reply_to_id_1", "correlation_id_1")

        mock_broker.sync_send.assert_called()
        assert len(mock_broker.sync_send.call_args_list) == 1
        assert mock_broker.sync_send.call_args_list[0].kwargs['body'] == 'response_1'
        assert mock_broker.sync_send.call_args_list[0].kwargs['routing_key'] == 'reply_to_id_1'
        assert mock_broker.sync_send.call_args_list[0].kwargs['correlation_id'] == 'correlation_id_1'

    def test_publish(self, mock_broker, broker_service):
        type = "type_1"
        message = {"some": "data"}
        broker_service.publish(type, message)

        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == type
        assert mock_broker.send.call_args_list[0].kwargs['body']['payload'] == message
