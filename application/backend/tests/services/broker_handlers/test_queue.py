import pytest
from marshmallow import ValidationError


@pytest.fixture
def message_handler(mocker):
    message_handler_mock = mocker.MagicMock()
    mocker.patch('app.services.broker.queue.MessageHandler', message_handler_mock)
    return message_handler_mock


@pytest.fixture
def rpc_queue(environment_variables, mock_broker):
    from app.services.broker.queue import rpc
    return rpc


@pytest.mark.usefixtures('client_class')
class TestBrokerQueueSuit:
    def test_message_parsing(self, mock_broker, message_handler, rpc_queue):
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "dontCare",
            "payload": {"dont": "care"}
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        message_handler.process_message.assert_called_once()
        mock_broker.sync_send.assert_not_called()

    def test_message_parsing_fail(self, mock_broker, message_handler, rpc_queue):
        rpc_queue(routing_key="dontCareRoutingKey", body={
            "payload": {"dont": "care"}
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        message_handler.process_message.assert_not_called()
        mock_broker.sync_send.assert_called_once()

    def test_process_message_fail(self, mocker, mock_broker, message_handler, rpc_queue):
        process_message = mocker.MagicMock()()
        process_message.side_effect = ValidationError("test")
        message_handler.process_message = process_message

        rpc_queue(routing_key="dontCareRoutingKey", body={
            "type": "dontCare",
            "payload": {"dont": "care"}
        }, correlation_id="dontCareCorrelationId", reply_to="dontCareReplyTo")

        message_handler.process_message.assert_called_once()
        mock_broker.sync_send.assert_called_once()
