from flask import current_app

from app.services.broker.temp.RabbitMQ import RabbitMQ

from rabbitmq_pika_flask.ExchangeType import ExchangeType
from app.services.broker.schemas.message import MessageSchema


broker = RabbitMQ()

class BrokerService:
    @classmethod
    def respond(cls, response, reply_to, correlation_id):
        broker.sync_send(
            body=response,
            routing_key=reply_to,
            exchange_type=ExchangeType.DIRECT,
            retries=5,
            message_version="v1.0.0",
            correlation_id=correlation_id
        )

    @classmethod
    def publish(cls, type, response):
        message_schema = MessageSchema()
        message = message_schema.load({
            'type': type,
            'payload': response
        })
        broker.send(
            body=message,
            routing_key=current_app.config["MQ_EVENT_KEY"],
            exchange_type=ExchangeType.DIRECT,
            retries=5,
            message_version="v1.0.0"
        )
