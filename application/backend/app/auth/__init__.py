from oauthlib.oauth2 import WebApplicationClient
from flask_jwt_extended import JWTManager, get_jwt, get_jwt_identity, set_access_cookies, create_access_token
from app.repositories.user_repository import UserRepository
from datetime import datetime, timedelta, timezone

from app.models.user_schema import UserSchema


class AuthClient():
    client: WebApplicationClient

    def __init__(self, app=None, **kwargs):
        if (app):
            self.init_app(app, **kwargs)

    def init_app(self, app, **kwargs):
        self.client = WebApplicationClient(
            app.config["SLACK_CLIENT_ID"], kwargs=kwargs)


auth = AuthClient()
jwt = JWTManager()

# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    user = UserRepository.get_by_id(identity)
    return user


def refresh_cookie(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=2))
        if target_timestamp > exp_timestamp:
            identity = get_jwt_identity()
            user = UserRepository.get_by_id(identity)
            json_user = UserSchema().dump(user)
            additional_claims = {
                # TODO handle roles
                "user": {**json_user, "roles": []}
            }
            print("\n\nRefreshing cookie :)))\n\n")
            access_token = create_access_token(
                identity=user, additional_claims=additional_claims)
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response
