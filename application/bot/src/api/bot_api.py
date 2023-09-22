#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pytz
import os
from injector import inject

from src.api.slack_api import SlackApi
from datetime import datetime, timedelta
from src.rsvp import RSVP
from src.broker.broker_client import BrokerClient
from src.injector import injector
import logging
from src.i18n import Translator

class BotApi:
    @inject
    def __init__(self, logger: logging.Logger):
        self.REPLY_DEADLINE_IN_HOURS = int(os.environ["REPLY_DEADLINE_IN_HOURS"])
        self.HOURS_BETWEEN_REMINDERS = int(os.environ["HOURS_BETWEEN_REMINDERS"])
        self.logger: logging.Logger = logger
        self.translator: Translator = injector.get(Translator)

    def __enter__(self):
        self.client = injector.get(BrokerClient)
        return self

    def __exit__(self, type, value, traceback):
        self.client.disconnect()

    def welcome(self, slack_client, team_id):
        channel_id = self.join_channel(slack_client=slack_client, team_id=team_id)
        self.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("botWelcome"),
            slack_client=slack_client
        )

    def join_channel(self, slack_client, team_id, channel_id=None):
        new_installation = channel_id is None

        # Get default channel if non is given
        if channel_id is None:
            default_channel = slack_client.get_default_channel()
            channel_id = default_channel["id"]

        # Log and exit if we were unable to find a channel
        if channel_id is None:
            self.logger.error("Was unable to find channel")
            return None

        # Join channel
        join_success = slack_client.join_channel(channel_id)
        # If we were unable to join the channel
        if not join_success:
            self.logger.error("Was unable to join channel %s in team: %s", channel_id, team_id)
            return None
        
        # Send a rpc message to set the channel
        set_channel_response = self.client.set_slack_channel(channel_id=channel_id, team_id=team_id)

        if not set_channel_response['success']:
            self.send_slack_message(
                channel_id=channel_id,
                text=self.translator.translate("pizzaChannelError"),
                slack_client=slack_client
            )
            self.logger.error("Was unable to join channel %s", channel_id)
            # Leave the channel we joined after sending the error message to slack
            leave_success = slack_client.leave_channel(channel_id)
            return None
    
        # If there are scheduled events
        elif not new_installation and 'scheduled_events_count' in set_channel_response and set_channel_response['scheduled_events_count'] > 0:
            self.send_slack_message(
                channel_id=channel_id,
                text=self.translator.translate(
                    "pizzaChannelErrorScheduledEvents", 
                    count=set_channel_response['scheduled_events_count']
                ),
                slack_client=slack_client
            )
            leave_success = slack_client.leave_channel(channel_id)
            return None
        

        # Leave channel if old and new channel isnt the same
        # they can be the same if someone reinstall the app
        if 'old_channel_id' in set_channel_response and channel_id != set_channel_response['old_channel_id']:
            leave_success = slack_client.leave_channel(set_channel_response['old_channel_id'])
            # If we were unable to leave the channel, we dont exit function as it isnt critical to leave
            if not leave_success:
                self.logger.error("Was unable to leave channel %s", channel_id)

        return channel_id
    
    def handle_user_left_channel(self, team_id, user_id, channel_id, slack_client):
        slack_installation = self.client.get_slack_installation(team_id=team_id)
        if slack_installation is None or 'channel_id' not in slack_installation:
            self.logger.error("Failed to get slack installation for team %s", team_id)
            return
        if slack_installation['channel_id'] != channel_id:
            return
        scheduled_events = self.client.get_scheduled_events_for_user(team_id=team_id, user_id=user_id)
        if scheduled_events == False:
            self.logger.error("Failed to get scheduled events for user %s", user_id)
            return
        # set non active
        user_to_update = {
            'id': user_id,
            'team_id': team_id,
            'active': False
        }
        self.client.update_slack_users(users_to_update=[user_to_update])
        
        # Respond to invited events
        for scheduled_event in scheduled_events:
            rsvp = scheduled_event['responded']
            if rsvp == RSVP.not_attending:
                continue

            elif rsvp == RSVP.attending:
                success = self.withdraw_invitation(event_id=scheduled_event['event_id'], slack_id=user_id)
                if success:
                    self.send_pizza_invited_but_left_channel(channel_id=user_id, ts=scheduled_event['slack_message_ts'], slack_client=slack_client, prev_answer=RSVP.attending)
                else:
                    self.logger.error("Failed to withdraw invitation after leaving channel for user %s", user_id)

            elif rsvp == RSVP.unanswered:
                success = self.decline_invitation(event_id=scheduled_event['event_id'], slack_id=user_id)
                if success:
                    self.send_pizza_invited_but_left_channel(channel_id=user_id, ts=scheduled_event['slack_message_ts'], slack_client=slack_client, prev_answer=RSVP.unanswered)
                else:
                    self.logger.error("Failed to decline invitetion after leaving channel for user %s", user_id)
                
        # Send message to user that they no longer will be invited to events
        self.send_slack_message(
            channel_id=user_id,
            text=self.translator.translate("userLeftChannel"),
            slack_client=slack_client
        )

    def invite_multiple_if_needed(self):
        events = self.client.invite_multiple_if_needed()
        for event in events:
            slack_client = SlackApi(token=event["bot_token"])
            self.invite_if_needed(event=event, slack_client=slack_client)

    def invite_if_needed(self, event, slack_client):
        self.logger.info("Inviting users for %s", event['event_id'])
        invited_users = event['invited_users']
        event_time = event['event_time']
        event_id = event['event_id']
        restaurant_name = event['restaurant_name']

        # timestamp (timestamp) is converted to UTC timestamp by psycopg2
        # Convert timestamp to appropriate timestamp
        timestamp = self.translator.format_timestamp(timestamp=event_time)
        for user_id in invited_users:
            slack_message = self.send_pizza_invite(
                channel_id=user_id,
                event_id=str(event_id),
                place=restaurant_name,
                datetime=timestamp.strftime("%A %d. %B %H:%M"),
                deadline=self.REPLY_DEADLINE_IN_HOURS,
                slack_client = slack_client
            )
            if not slack_message['ok']:
                self.logger.warn("Failed to send invitation to %s", user_id)
                continue
            self.logger.info("%s was invited to event on %s" % (user_id, timestamp))
            self.client.update_invitation(
                slack_id=user_id,
                event_id=event_id,
                update_values={
                    'slack_message': {
                        'ts': slack_message['ts'],
                        'channel_id': slack_message['channel']
                    }
                }
            )

    def send_reminders(self):
        invitations = self.client.get_unanswered_invitations()
        invitations.sort(key=lambda x: x["bot_token"])

        previous_invitation = None
        slack_client = None
        for invitation in invitations:
            if previous_invitation is None or previous_invitation["bot_token"] != invitation["bot_token"]:
                slack_client = SlackApi(token=invitation["bot_token"])
            previous_invitation = invitation
            # all timestamps (such as reminded_at) gets converted to UTC
            # so comparing it to datetime.now in UTC is correct
            remind_timestamp = datetime.now(pytz.utc) + timedelta(hours =- self.HOURS_BETWEEN_REMINDERS)
            if invitation['reminded_at'] < remind_timestamp:
                slack_client.send_slack_message(
                    channel_id=invitation['slack_id'],
                    text=self.translator.translate("eventReminder")
                )
                was_updated = self.client.update_invitation(
                    slack_id=invitation['slack_id'],
                    event_id=invitation['event_id'],
                    update_values={
                        "reminded_at": datetime.now().isoformat()
                    }
                )
                if was_updated:
                    self.logger.info("%s was reminded about an event." % invitation['slack_id'])
                else:
                    self.logger.warning("failed to update invitation")

    def send_event_finalized(self, timestamp, restaurant_name, slack_ids, channel_id, slack_client):
        self.logger.info("Finalizing event %s %s", timestamp, restaurant_name)
        # Convert timestamp to appropriate timestamp
        timestamp = self.translator.format_timestamp(timestamp=timestamp)
        # Create slack @-id-strings
        users = ['<@%s>' % user for user in slack_ids]
        ids_string = ", ".join(users)
        # Get the user to book
        booker = users[0]
        # Get the user to pay
        payer = users[1] if len(users) > 1 else users[0]
        # Send the finalization Slack message
        slack_client.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("eventFinalized", user_ids=ids_string, restaurant_name=restaurant_name, time_stamp=timestamp.strftime("%A %d. %B %H:%M"), booker=booker, payer=payer)
        )

    def send_event_unfinalized(self, timestamp, restaurant_name, slack_ids, channel_id, slack_client):
        self.logger.info("Unfinalizing event %s %s", timestamp, restaurant_name)
        # Convert timestamp to appropriate timestamp
        timestamp = self.translator.format_timestamp(timestamp=timestamp)
        # Create slack @-id-strings
        users = ['<@%s>' % user for user in slack_ids]
        ids_string = ", ".join(users)
        # Send message that the event unfinalized
        slack_client.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("eventUnfinalized", user_ids=ids_string, restaurant_name=restaurant_name, time_stamp=timestamp.strftime("%A %d. %B %H:%M"))
        )
        # Invite more users for the event
        self.invite_multiple_if_needed()

    def send_user_withdrew_after_finalization(self, user_id, timestamp, restaurant_name, channel_id, slack_client):
        self.logger.info("User %s withdrew from event %s %s", user_id, timestamp, restaurant_name)

        timestamp=self.translator.format_timestamp(timestamp=timestamp)

        # Send message that the user withdrew
        slack_client.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("userWithdrawAfterFinalization", user_id=user_id, restaurant_name=restaurant_name, time_stamp=timestamp.strftime("%A %d. %B %H:%M"))
        )
        # Invite more users for the event
        self.invite_multiple_if_needed()

    def auto_reply(self):
        invitations = self.client.get_unanswered_invitations()
        invitations.sort(key=lambda x: x["bot_token"])

        previous_invitation = None
        slack_client = None
        for invitation in invitations:
            if previous_invitation is None or previous_invitation["bot_token"] != invitation["bot_token"]:
                slack_client = SlackApi(token=invitation["bot_token"])
            previous_invitation = invitation
            deadline = invitation['invited_at'] + timedelta(hours=self.REPLY_DEADLINE_IN_HOURS)
            if deadline < datetime.now(pytz.utc):
                was_updated = self.update_invitation_answer(
                    slack_id=invitation['slack_id'],
                    event_id=invitation['event_id'],
                    answer=RSVP.not_attending
                )
                if was_updated:
                    # Update invitation message - remove buttons and tell user it expired
                    if 'slack_message' in invitation:
                        channel_id = invitation['slack_message']['channel_id']
                        ts = invitation['slack_message']['ts']
                        invitation_message = slack_client.get_slack_message(channel_id=channel_id, ts=ts)
                        blocks = invitation_message["blocks"][0:3]
                        self.send_invitation_expired(
                            channel_id=channel_id,
                            ts=ts,
                            old_blocks=blocks,
                            slack_client=slack_client
                        )
                    # Send the user a message that the invite expired
                    slack_client.send_slack_message(
                        channel_id=invitation['slack_id'],
                        text=self.translator.translate("autoReplyNoAttending")
                    )
                    self.logger.info("%s didn't answer. Setting RSVP to not attending." % invitation['slack_id'])
                else:
                    self.logger.warning("failed to update invitation to not attending")

    def clean_up_invitations(self):
        invitations = self.client.get_unanswered_invitations_on_finished_events_and_set_not_attending()
        invitations.sort(key=lambda x: x["bot_token"])

        previous_invitation = None
        slack_client = None
        for invitation in invitations:
            if previous_invitation is None or previous_invitation["bot_token"] != invitation["bot_token"]:
                slack_client = SlackApi(token=invitation["bot_token"])
            previous_invitation = invitation
            # Update invitation message - remove buttons and tell user it expired
            if 'slack_message' not in invitation:
                continue
            channel_id = invitation['slack_message']['channel_id']
            ts = invitation['slack_message']['ts']
            invitation_message = slack_client.get_slack_message(channel_id, ts)
            blocks = invitation_message["blocks"][0:3]
            self.send_invitation_expired(
                channel_id=channel_id,
                ts=ts,
                old_blocks=blocks,
                slack_client=slack_client
            )
            self.logger.info("%s didn't answer and event is finished. Removing accept/decline buttons" % invitation['slack_id'])

    def update_invitation_answer(self, slack_id, event_id, answer: RSVP):
        return self.client.update_invitation(
            slack_id=slack_id,
            event_id=event_id,
            update_values={
                "rsvp": answer
            }
        )

    def accept_invitation(self, event_id, slack_id):
        self.update_invitation_answer(slack_id=slack_id, event_id=event_id, answer=RSVP.attending)

    def decline_invitation(self, event_id, slack_id):
        self.update_invitation_answer(slack_id=slack_id, event_id=event_id, answer=RSVP.not_attending)

    def withdraw_invitation(self, event_id, slack_id):
        return self.client.withdraw_invitation(event_id=event_id, slack_id=slack_id)

    def save_image(self, cloudinary_id, slack_id, team_id, title):
        self.client.create_image(cloudinary_id=cloudinary_id, slack_id=slack_id, team_id=team_id, title=title)

    def get_invited_users(self):
        return self.client.get_invited_unanswered_user_ids()

    def sync_users_from_organizations(self):
        slack_organizations = self.client.get_slack_organizations()
        for slack_organization in slack_organizations:
            self.sync_users_from_organization(team_id=slack_organization['team_id'], bot_token=slack_organization['bot_token'])

    def sync_users_from_organization(self, team_id, bot_token):
        installation_info = self.client.get_slack_installation(team_id=team_id)
        if installation_info is None or 'channel_id' not in installation_info:
            self.logger.error("Failed to sync users in workspace %s" % team_id)
            return
        channel_id = installation_info['channel_id']
        slack_client = SlackApi(token=bot_token)
        users_to_update = slack_client.get_users_to_update_by_channel(channel_id=channel_id)
        response = self.client.update_slack_users(users_to_update)

        updated_users = response['updated_users']
        for user in updated_users:
            self.logger.info("Updated user %s" % user)
        failed_users = response['failed_users']
        for user in failed_users:
            self.logger.warning("Was unable to update %s" % user)

    def inform_users_unfinalized_event_got_cancelled(self, time, restaurant_name, slack_data, slack_client):
        self.logger.info("unfinalized event got cancelled")
        for slack_user_data in slack_data:
            slack_id = slack_user_data['user_id']
            # Update invitation message - remove buttons and tell user it has been cancelled
            channel_id = slack_user_data['invitation_message']['channel_id']
            ts = slack_user_data['invitation_message']['ts']
            invitation_message = slack_client.get_slack_message(channel_id=channel_id, ts=ts)
            blocks = invitation_message["blocks"][0:3]
            self.send_invitation_invalidated_event_cancelled(
                channel_id=channel_id,
                ts=ts,
                old_blocks=blocks,
                slack_client=slack_client
            )
            # Send the user a message that the event has been cancelled
            slack_client.send_slack_message(
                channel_id=slack_id,
                text=self.translator.translate("unfinalizedEventCancelled", restaurant_name=restaurant_name, time_stamp=time.strftime("%A %d. %B %H:%M"))
            )
            self.logger.info("Informed user: %s" % slack_id)

    def inform_users_finalized_event_got_cancelled(self, time, restaurant_name, slack_data, channel_id, slack_client):
        # Send the users a message in the pizza channel that the event has been cancelled
        slack_user_ids = [user['user_id'] for user in slack_data]
        users = ['<@%s>' % user_id for user_id in slack_user_ids]
        ids_string = ", ".join(users)
        self.logger.info("finalized event got cancelled for users %s" % ", ".join(slack_user_ids))
        slack_client.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("finalizedEventCancelled", user_ids=ids_string, restaurant_name=restaurant_name, time_stamp=time.strftime("%A %d. %B %H:%M"))
        )
        # Update invitation message - remove buttons and tell user it has been cancelled
        for slack_user_data in slack_data:
            user_channel_id = slack_user_data['invitation_message']['channel_id']
            ts = slack_user_data['invitation_message']['ts']
            invitation_message = slack_client.get_slack_message(channel_id=user_channel_id, ts=ts)
            blocks = invitation_message["blocks"][0:3]
            self.send_invitation_invalidated_event_cancelled(
                channel_id=user_channel_id,
                ts=ts,
                old_blocks=blocks,
                slack_client=slack_client
            )

    def inform_users_unfinalized_event_got_updated(self, old_time, time, old_restaurant_name, restaurant_name, slack_ids, slack_client):
        self.logger.info("unfinalized event got updated")
        for slack_id in slack_ids:
            slack_client.send_slack_message(
                channel_id=slack_id,
                text=self.translator.translate("unfinalizedEventUpdate", old_restaurant_name=old_restaurant_name, old_time_stamp=old_time.strftime("%A %d. %B %H:%M"),restaurant_name=restaurant_name, time_stamp=time.strftime("%A %d. %B  %H:%M"))
            )
            self.logger.info("Informed user: %s" % slack_id)

    def inform_users_finalized_event_got_updated(self, old_time, time, old_restaurant_name, restaurant_name, slack_ids, channel_id, slack_client):
        users = ['<@%s>' % user for user in slack_ids]
        ids_string = ", ".join(users)
        self.logger.info("finalized event got updated for users %s" % ", ".join(slack_ids))
        slack_client.send_slack_message(
            channel_id=channel_id,
            text=self.translator.translate("finalizedEventUpdate", user_ids=ids_string, old_restaurant_name=old_restaurant_name, old_time_stamp=old_time.strftime("%A %d. %B %H:%M"),restaurant_name=restaurant_name, time_stamp=time.strftime("%A %d. %B  %H:%M"))
        )

    def send_slack_message(self, channel_id, text, slack_client, blocks=None, thread_ts=None):
        return slack_client.send_slack_message(channel_id=channel_id, text=text, blocks=blocks, thread_ts=thread_ts)

    def update_slack_message(self, channel_id, ts, slack_client, text=None, blocks=None):
        return slack_client.update_slack_message(channel_id, ts, text, blocks)

    def send_pizza_invite(self, channel_id, event_id, place, datetime, deadline, slack_client):
        top_level_title_text = self.translator.translate("topLevelPizzaInvitation", restaurant_name=place, time_stamp=datetime)
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("pizzaInvitationHeader")
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("pizzaInvitationBody", restaurant_name=place, time_stamp=datetime, deadline=deadline)
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": self.translator.translate("pizzaInvitationAttendButton")
                        },
                        "value": event_id,
                        "action_id": "rsvp_yes",
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": self.translator.translate("pizzaInvitationNoAttendButton")
                        },
                        "value": event_id,
                        "action_id": "rsvp_no",
                    }
                ]
            }
        ]
        return slack_client.send_slack_message(channel_id=channel_id, text=top_level_title_text, blocks=blocks)

    def clean_blocks(self, blocks):
        for block in blocks:
            del block["block_id"]
            if "text" in block and "emoji" in block["text"]:
                del block["text"]["emoji"]
        return blocks

    def send_pizza_invite_loading(self, channel_id, ts, old_blocks, event_id, slack_client):
        self.logger.info('updating invitation message to LOADING for %s, %s' % (channel_id, event_id))
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": self.translator.translate("inviteLoading")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_pizza_invite_not_among_invited_users(self, channel_id, ts, old_blocks, event_id, slack_client):
        self.logger.info('updating invitation message to not among invited for %s, %s' % (channel_id, event_id))
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("inviteNotAmongUsers")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_update_pizza_invite_attending(self, channel_id, ts, event_id, slack_client):
        self.logger.info('updating invitation message to attending for %s, %s' % (channel_id, event_id))
        invitation_message = slack_client.get_slack_message(channel_id, ts)
        blocks = invitation_message["blocks"][0:3]
        self.send_pizza_invite_answered(
            channel_id=channel_id,
            ts=ts,
            event_id=event_id,
            old_blocks=blocks,
            attending=True,
            slack_client = slack_client
        )

    def send_update_pizza_invite_not_attending(self, channel_id, ts, event_id, slack_client):
        self.logger.info('updating invitation message to not_attending for %s, %s' % (channel_id, event_id))
        invitation_message = slack_client.get_slack_message(channel_id, ts)
        blocks = invitation_message["blocks"][0:3]
        self.send_pizza_invite_answered(
            channel_id=channel_id,
            ts=ts,
            event_id=event_id,
            old_blocks=blocks,
            attending=False,
            slack_client = slack_client
        )

    def send_update_pizza_invite_unanswered(self, channel_id, ts, event_id, slack_client):
        self.logger.info('updating invitation message to unanswered for %s, %s' % (channel_id, event_id))
        invitation_message = slack_client.get_slack_message(channel_id, ts)
        blocks = invitation_message["blocks"][0:3]
        old_blocks = self.clean_blocks(blocks)
        new_blocks = [{
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": self.translator.translate("pizzaInvitationAttendButton")
                    },
                    "value": str(event_id),
                    "action_id": "rsvp_yes",
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": self.translator.translate("pizzaInvitationNoAttendButton")
                    },
                    "value": str(event_id),
                    "action_id": "rsvp_no",
                }
            ]
        }]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_pizza_invite_answered(self, channel_id, ts, event_id, old_blocks, attending, slack_client):
        old_blocks = self.clean_blocks(old_blocks)
        new_blocks_common = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("pizzaInviteAnswerAttend") if attending else self.translator.translate("pizzaInviteAnswerNoAttend") ,
                }
            }
        ]
        new_blocks_yes = [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": self.translator.translate("unsubscribeBody")
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": self.translator.translate("unsubscribeButton")
                    },
                    "value": str(event_id),
                    "action_id": "rsvp_withdraw"
                }
            }
        ]
        blocks = old_blocks + new_blocks_common
        if attending:
            blocks += new_blocks_yes
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_invitation_invalidated_event_cancelled(self, channel_id, ts, old_blocks, slack_client):
        old_blocks = self.clean_blocks(old_blocks)
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("invalidatedEventCancelled")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_invitation_expired(self, channel_id, ts, old_blocks, slack_client):
        old_blocks = self.clean_blocks(old_blocks)
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("invitationExpired")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_pizza_invite_withdraw(self, channel_id, ts, old_blocks, slack_client):
        old_blocks = self.clean_blocks(old_blocks)
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("inviteWithdrawn")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)

    def send_pizza_invite_withdraw_failure(self, channel_id, ts, old_blocks, slack_client):
        old_blocks = self.clean_blocks(old_blocks)
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("inviteWithdrawnFailure")
                }
            }
        ]
        blocks = old_blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)
    

    def send_pizza_invited_but_left_channel(self, channel_id, ts, slack_client, event_id, prev_answer: RSVP):
        self.logger.info('user left and sent message of widthdrawal for %s, %s' % (channel_id, event_id))
        invitation_message = slack_client.get_slack_message(channel_id, ts)
        blocks = invitation_message["blocks"][0:3]
        new_blocks = [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": self.translator.translate("invitedButLeftChannelWithdrawn") if prev_answer == RSVP.attending else self.translator.translate("invitedButLeftChannelUnanswered")
                }
            }
        ]
        blocks = blocks + new_blocks
        return slack_client.update_slack_message(channel_id=channel_id, ts=ts, blocks=blocks)
