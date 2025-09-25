from app.models.slack_user import SlackUser
from app.repositories.slack_user_repository import SlackUserRepository
from app.models.slack_user_schema import SlackUserSchema

class SlackUserService:
    def get(self, filters = {}, page = None, per_page = None, order_by_ascending = True, team_id = None):
        order_by = SlackUser.current_username.asc if order_by_ascending else SlackUser.current_username.desc
        return SlackUserRepository.get(filters = filters, page = page, per_page = per_page, order_by = order_by, team_id = team_id)

    def get_by_id(self, slack_user_id, team_id):
        slack_user = SlackUserRepository.get_by_id(slack_user_id)
        if slack_user is None or slack_user.slack_organization_id != team_id:
            return None
        return slack_user

    def add(self, data, team_id):
        slack_user = SlackUserSchema().load(data=data, partial=True)
        slack_user.slack_organization_id = team_id
        return SlackUserRepository.upsert(slack_user)

    def update(self, slack_user_id, data, team_id):
        slack_user = SlackUserRepository.get_by_id(slack_user_id)

        if slack_user is None or slack_user.slack_organization_id != team_id:
            return None

        updated_slack_user = SlackUserSchema().load(data=data, instance=slack_user, partial=True)
        return SlackUserRepository.upsert(updated_slack_user)

    def get_user_ids_to_invite(self, number_to_invite, event_id, number_of_user, people_per_event):
        users_to_invite = SlackUserRepository.get_users_to_invite(number_to_invite, event_id, number_of_user, people_per_event)
        return [row.slack_id for row in users_to_invite]

    def get_invited_unanswered_user_ids(self):
        return SlackUserRepository.get_invited_unanswered_user_ids()
