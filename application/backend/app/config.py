import os
from datetime import timedelta

class Base(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    # DATABASE_URL is the environment variable created by heroku during production deployment
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL').replace("postgres://", "postgresql://", 1) if 'DATABASE_URL' in os.environ else f'postgresql://{os.environ.get("DB_USER")}:{os.environ.get("DB_PASSWD")}@{os.environ.get("DB_HOST")}:{os.environ.get("DB_PORT")}/{os.environ.get("DB_NAME")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SLACK_DISCOVERY_URL = "https://slack.com/.well-known/openid-configuration"
    API_TITLE = "API"
    API_VERSION = "v1"
    # Swagger config
    OPENAPI_VERSION = "3.0.2"
    # Api json docs is available under /doc/openapi.json
    OPENAPI_URL_PREFIX = "/doc"
    # The swagger UI is displayed under /doc/swagger
    OPENAPI_SWAGGER_UI_PATH = "/swagger"
    # The following is equivalent to OPENAPI_SWAGGER_UI_VERSION = '3.19.5'
    OPENAPI_SWAGGER_UI_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.19.5/"
    # JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class Test(Base):
    DEBUG = True
    FRONTEND_URI = 'localhost'
    SLACK_CLIENT_ID = 'dontCareSlackClientId'
    SLACK_CLIENT_SECRET = 'dontCareSlackClientSecret'
    MQ_EVENT_QUEUE = 'dontCareMqEventQueue'
    MQ_EVENT_KEY = 'dontCareMqEventKey'
    CLOUDINARY_CLOUD_NAME = 'dontCareCloudinaryCloudName'
    CLOUDINARY_API_KEY = 'dontCareCloudinaryApiKey'
    CLOUDINARY_API_SECRET = 'dontCareCloudinaryApiSecret'
    DAYS_IN_ADVANCE_TO_INVITE = 10


class Production(Base):
    FRONTEND_URI = os.environ.get("FRONTEND_URI").rstrip('/') if 'FRONTEND_URI' in os.environ else None
    # RabbitMQ - CLOUDAMQP_URL is the environment variable created by heroku during production deployment
    MQ_URL = os.environ.get('MQ_URL') if 'MQ_URL' in os.environ else os.environ.get('CLOUDAMQP_URL')
    MQ_EXCHANGE = os.environ.get('MQ_EXCHANGE')
    MQ_EVENT_QUEUE = os.environ.get('MQ_EVENT_QUEUE')
    MQ_EVENT_KEY = os.environ.get('MQ_EVENT_KEY')
    MQ_RPC_KEY = os.environ.get('MQ_RPC_KEY')
    DAYS_IN_ADVANCE_TO_INVITE = os.environ.get('DAYS_IN_ADVANCE_TO_INVITE')
    SLACK_CLIENT_ID = os.environ.get('SLACK_CLIENT_ID')
    SLACK_CLIENT_SECRET = os.environ.get('SLACK_CLIENT_SECRET')
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
