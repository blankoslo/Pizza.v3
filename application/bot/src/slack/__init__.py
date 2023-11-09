import requests
import base64
import logging
import os
import time
from functools import wraps
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from slack_bolt.oauth.oauth_settings import OAuthSettings
from slack_sdk.oauth.state_store import FileOAuthStateStore

from src.api.bot_api import BotApi
from src.injector import injector
from src.slack.installation_store import BrokerInstallationStore
from src.api.slack_api import SlackApi
from src.i18n import Translator

slack_signing_secret = os.environ["SLACK_SIGNING_SECRET"]
client_id = os.environ["SLACK_CLIENT_ID"],
client_secret = os.environ["SLACK_CLIENT_SECRET"],
slack_app_token = os.environ["SLACK_APP_TOKEN"]


slack_app = App(
    signing_secret=slack_signing_secret,
    installation_store=BrokerInstallationStore(),
    oauth_settings=OAuthSettings(
        client_id=client_id,
        client_secret=client_secret,
        state_store=FileOAuthStateStore(expiration_seconds=600),
    ),
)
# Enable delete_installation handling in the Installation store
slack_app.enable_token_revocation_listeners()
# Enable socket mode
slack_handler = SocketModeHandler(slack_app, slack_app_token)

def request_time_monitor(timeout=3000):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = injector.get(logging.Logger)
            start_time = time.time()
            user_id = None
            if "body" in kwargs and "event" in kwargs["body"]:
                user_id = kwargs["body"]["event"].get("user")
                if user_id is None:
                    user_id = kwargs["body"]["event"].get("user_id")
            elif "body" in kwargs and "user" in kwargs["body"]:
                user_id = kwargs["body"]["user"].get("id")
            response = func(*args, **kwargs)
            end_time = time.time()
            execution_time = round((end_time - start_time) * 1000, 2)
            # Log execution time of function if over timeout limit as using more than the timeout limit usually
            # means that the slack request will fail and the user will get a ⚠️
            if execution_time > timeout:
                logger.warn(f"Function {func.__name__} took {execution_time}ms to execute. User ID: {user_id}")
            return response
        return wrapper
    return decorator

@slack_app.event("message")
@request_time_monitor()
def handle_event(body, say, context):
    event = body["event"]
    token = context["token"]
    client = SlackApi(client=context["client"])
    # Handle a file share
    if "subtype" in event and event["subtype"] == 'file_share':
        handle_file_share(event=event, say=say, token=token, client=client)


@slack_app.event("member_left_channel")
@request_time_monitor()
def handle_event(body, say, context):
    event = body["event"]
    client = SlackApi(client=context["client"])
    # Handle a user leaving a channel
    if "channel" in event and "user" in event and "team" in event:
        channel_id = event["channel"]
        team_id = event["team"]
        user_id = event["user"]
        with injector.get(BotApi) as ba:
            ba.handle_user_left_channel(channel_id=channel_id, team_id=team_id, user_id=user_id, slack_client=client)


def handle_rsvp(body, ack, attending, client):
    user = body["user"]
    user_id = user["id"]
    channel = body["channel"]
    channel_id = channel["id"]
    message = body["message"]
    ts = message['ts']
    event_id = body["actions"][0]["value"]
    blocks = message["blocks"][0:3]
    # Use bot client outside `with` to not get slowed down by getting a connection
    bot_client = injector.get(BotApi)
    # Send loading message and acknowledge the slack request
    bot_client.send_pizza_invite_loading(channel_id=channel_id, ts=ts, old_blocks=blocks, event_id=event_id, slack_client=client)
    ack()
    with bot_client as ba:
        # Handle request
        invited_users = ba.get_invited_users()
        if user_id in invited_users:
            # Update invitation
            if attending:
                ba.accept_invitation(event_id=event_id, slack_id=user_id)
            else:
                ba.decline_invitation(event_id=event_id, slack_id=user_id)
                ba.invite_multiple_if_needed()
            # Update the user's invitation message
            ba.send_pizza_invite_answered(channel_id=channel_id, ts=ts, event_id=event_id, old_blocks=blocks, attending=attending, slack_client=client)
        else:
            # Handle user that wasn't among invited users
            ba.send_pizza_invite_not_among_invited_users(channel_id=channel_id, ts=ts, old_blocks=blocks, event_id=event_id, slack_client=client)

@slack_app.action("rsvp_yes")
@request_time_monitor()
def handle_rsvp_yes(ack, body, context):
    client = SlackApi(client=context["client"])
    handle_rsvp(body=body, ack=ack, attending=True, client=client)

@slack_app.action("rsvp_no")
@request_time_monitor()
def handle_rsvp_no(ack, body, context):
    client = SlackApi(client=context["client"])
    handle_rsvp(body=body, ack=ack, attending=False, client=client)

@slack_app.action("rsvp_withdraw")
@request_time_monitor()
def handle_rsvp_withdraw(ack, body, context):
    logger = injector.get(logging.Logger)
    client = SlackApi(client=context["client"])
    message = body["message"]
    user = body["user"]
    user_id = user["id"]
    channel = body["channel"]
    channel_id = channel["id"]
    event_id = body["actions"][0]["value"]
    ts = message['ts']
    blocks = message["blocks"][0:3]
    bot_client = injector.get(BotApi)
    # Send loading message and acknowledge the slack request
    bot_client.send_pizza_invite_loading(channel_id=channel_id, ts=ts, old_blocks=blocks, event_id=event_id, slack_client=client)
    ack()
    with bot_client as ba:
        # Try to withdraw the user
        success = ba.withdraw_invitation(event_id=event_id, slack_id=user_id)
        if success:
            logger.info("%s withdrew their invitation", user_id)
            ba.send_pizza_invite_withdraw(channel_id=channel_id, ts=ts, old_blocks=blocks, slack_client=client)
        else:
            logger.warning("failed to withdraw invitation for %s", user_id)
            ba.send_pizza_invite_withdraw_failure(channel_id=channel_id, ts=ts, old_blocks=blocks, slack_client=client)


def handle_file_share(event, say, token, client):
    return
    translator = injector.get(Translator)
    channel = event["channel"]
    if 'files' in event and 'thread_ts' not in event:
        files = event['files']
        with injector.get(BotApi) as ba:
            ba.send_slack_message(channel_id=channel, text=translator.translate("thanksForFile"), slack_client=client)
            headers = {u'Authorization': u'Bearer %s' % token}
            for file in files:
                r = requests.get(
                    file['url_private'], headers=headers)
                b64 = base64.b64encode(r.content).decode('utf-8')
                payload = {
                    'file': 'data:image;base64,%s' % b64,
                    'upload_preset': 'blank.pizza.v2', # TODO: Change to own preset based on pizzabot v3 and org
                    'tags': ','.join(['pizza', file['user_team']])
                }
                r2 = requests.post(
                    'https://api.cloudinary.com/v1_1/blank/image/upload', data=payload)
                ba.save_image(
                    cloudinary_id=r2.json()['public_id'],
                    slack_id=file['user'],
                    team_id=file['user_team'],
                    title=file['title'])

@slack_app.command("/set-pizza-channel")
def handle_some_command(ack, body, say, context):
    translator = injector.get(Translator)
    ack()
    with injector.get(BotApi) as ba:
        team_id = body["team_id"]
        message_channel_id = body["channel_id"]
        client = SlackApi(client=context["client"])
        channel_id = ba.join_channel(client, team_id, message_channel_id)
        if channel_id is not None:
            ba.send_slack_message(
                channel_id=channel_id,
                text=translator.translate("pizzaChannelConfirm", channel_id=channel_id),
                slack_client=client
            )

# This only exists to make bolt not throw a warning that we dont handle the file_shared event
# We dont use this as we use the message event with subtype file_shared as that one
# contains a full file object with url_private, while this one only contains the ID
# Perhaps another file event contains the full object?
@slack_app.event("file_shared")
@request_time_monitor()
def handle_file_shared_events(body):
    pass
