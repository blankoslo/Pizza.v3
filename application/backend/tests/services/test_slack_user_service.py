import pytest
import pytz
from datetime import datetime
from app.services.slack_user_service import SlackUserService
from app.models.slack_user import SlackUser

@pytest.fixture
def slack_user_service():
    return SlackUserService()


@pytest.mark.usefixtures('client_class')
class TestSlackUserServiceSuit:
    def test_get(self, slack_organizations, slack_users, slack_user_service):
        team_id = slack_organizations[0].team_id
        slack_users = slack_users.get(team_id)
        test_slack_users = slack_user_service.get(filters={}, page=1, per_page=10, team_id=team_id)

        sorted_slack_users = sorted(slack_users, key=lambda x: x.slack_id)
        sorted_test_slack_users = sorted(test_slack_users[1], key=lambda x: x.slack_id)
        for x,y in zip(sorted_slack_users, sorted_test_slack_users):
            assert x == y

    def test_get_by_id(self, slack_organizations, slack_users, slack_user_service):
        team_id = slack_organizations[0].team_id
        slack_user = slack_users.get(team_id)[0]
        test_slack_user = slack_user_service.get_by_id(slack_user_id=slack_user.slack_id, team_id=team_id)
        assert slack_user == test_slack_user

    def test_add(self, slack_organizations, slack_user_service):
        team_id = slack_organizations[0].team_id
        new_slack_user = {
            "slack_id": "dontCareSlackId",
            "current_username": "dontCareUsername",
            "first_seen": datetime.now().isoformat(),
            "active": True,
            "priority": 1,
            "email": "dont@care.invalid"
        }
        slack_user_service.add(data=new_slack_user, team_id=team_id)
        test_slack_users = SlackUser.query.all()
        assert len(test_slack_users) == 1

    def test_update(self, db, slack_organizations, slack_users, slack_user_service):
        team_id = slack_organizations[0].team_id
        slack_user = slack_users.get(team_id)[0]

        date = datetime.now(pytz.timezone('Europe/Oslo'))
        update_data = {
            "current_username": "dontCareNewUsername",
            "first_seen": date.isoformat(),
            "active": False,
            "priority": 2,
            "email": "dont@careNew.invalid",
        }
        slack_user_service.update(slack_user_id=slack_user.slack_id, data=update_data, team_id=team_id)

        updated_slack_user = db.session.get(SlackUser, slack_user.slack_id)
        assert updated_slack_user.current_username == "dontCareNewUsername"
        assert updated_slack_user.first_seen == date
        assert updated_slack_user.active is False
        assert updated_slack_user.priority == 2
        assert updated_slack_user.email == "dont@careNew.invalid"

    def test_get_user_ids_to_invite(self, slack_organizations, events, slack_user_service):
        event = events.get(slack_organizations[0].team_id)[0]
        ids = slack_user_service.get_user_ids_to_invite(number_to_invite=5, event_id=event.id, number_of_user=2, people_per_event=5)
        assert len(ids) == 2

    def test_get_invited_unanswered_user_ids(self, invitations, slack_user_service):
        ids = slack_user_service.get_invited_unanswered_user_ids()
        assert len(ids) == 2
