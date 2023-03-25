import pytest
import uuid
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_slack_users

@pytest.mark.usefixtures('client_class')
class TestSlackUsersSuit:
    def test_slack_users_get(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_users = slack_users.get(user.slack_organization_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.users.SlackUsers', method='get'), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 2
        assert_slack_users(response_slack_users=response_data, slack_users=slack_users)

    def test_slack_users_by_id_get(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_user = slack_users.get(user.slack_organization_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.users.SlackUsersById', method='get', slack_user_id=slack_user.slack_id), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert_slack_users(response_slack_users=[response_data], slack_users=[slack_user])

    def test_slack_users_by_id_get_not_owned(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_user = slack_users.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.users.SlackUsersById', method='get', slack_user_id=slack_user.slack_id), headers=headers)
        assert response.status_code == 404

    def test_slack_users_by_id_put_priority(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_user = slack_users.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "priority": 5
        }
        response = self.client.put(url_for('api.users.SlackUsersById', method='put', slack_user_id=slack_user.slack_id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_slack_users_by_id_put_active(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_user = slack_users.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "active": False
        }
        response = self.client.put(url_for('api.users.SlackUsersById', method='put', slack_user_id=slack_user.slack_id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_slack_users_by_id_put_not_owned(self, slack_organizations, users, slack_users):
        user = users.get(slack_organizations[0].team_id)
        slack_user = slack_users.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "active": False
        }
        response = self.client.put(url_for('api.users.SlackUsersById', method='put', slack_user_id=slack_user.slack_id), headers=headers, json=payload)
        assert response.status_code == 404

    def test_slack_users_endpoint_authentication(self, slack_users, slack_organizations):
        slack_user = slack_users.get(slack_organizations[0].team_id)[0]

        response = self.client.get(url_for('api.users.SlackUsers', method='get'))
        assert response.status_code == 401
        response = self.client.get(url_for('api.users.SlackUsersById', method='get', slack_user_id=slack_user.slack_id))
        assert response.status_code == 401
        response = self.client.put(url_for('api.users.SlackUsersById', method='put', slack_user_id=slack_user.slack_id), json={"active": False})
        assert response.status_code == 401
