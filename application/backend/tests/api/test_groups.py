import pytest
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_groups


@pytest.mark.usefixtures('client_class')
class TestGroupsSuit:
    def test_groups_get(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        groups = groups.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.groups.Groups', method='get'), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 1
        assert_groups(response_groups=response_data, groups=groups)

    def test_groups_post_empty_members(self, slack_organizations, users):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            'name': "dontCareName",
            'members': []
        }
        response = self.client.post(url_for('api.groups.Groups', method='post'), headers=headers, json=payload)
        assert response.status_code == 201

    def test_groups_post_with_members(self, slack_organizations, slack_users, users):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            'name': "dontCareName",
            'members': [slack_users.get(slack_organizations[0].team_id)[0].slack_id]
        }
        response = self.client.post(url_for('api.groups.Groups', method='post'), headers=headers, json=payload)
        assert response.status_code == 201

    def test_groups_post_with_member_not_owned(self, slack_organizations, slack_users, users):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            'name': "dontCareName",
            'members': [slack_users.get(slack_organizations[1].team_id)[0].slack_id]
        }
        response = self.client.post(url_for('api.groups.Groups', method='post'), headers=headers, json=payload)
        assert response.status_code == 400

    def test_groups_by_id_get(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.groups.GroupsById', method='get', group_id=group.id), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert_groups([response_data], [group])

    def test_groups_by_id_get_not_owned(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.groups.GroupsById', method='get', group_id=group.id), headers=headers)
        assert response.status_code == 404

    def test_groups_by_id_patch_name(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "dontCareNewName",
        }
        response = self.client.patch(url_for('api.groups.GroupsById', method='patch', group_id=group.id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_groups_by_id_patch_members(self, slack_organizations, users, groups, slack_users):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "members": [slack_users.get(slack_organizations[0].team_id)[1].slack_id],
        }
        response = self.client.patch(url_for('api.groups.GroupsById', method='patch', group_id=group.id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_groups_by_id_patch_members_not_owned(self, slack_organizations, users, groups, slack_users):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "members": [slack_users.get(slack_organizations[1].team_id)[0].slack_id],
        }
        response = self.client.patch(url_for('api.groups.GroupsById', method='patch', group_id=group.id), headers=headers, json=payload)
        assert response.status_code == 404

    def test_groups_by_id_patch_not_owned(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "dontCareNewName",
        }
        response = self.client.patch(url_for('api.groups.GroupsById', method='patch', group_id=group.id), headers=headers, json=payload)
        assert response.status_code == 404

    def test_groups_by_id_delete(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.groups.GroupsById', method='delete', group_id=group.id), headers=headers)
        assert response.status_code == 204

    def test_groups_by_id_delete_not_owned(self, slack_organizations, users, groups):
        user = users.get(slack_organizations[0].team_id)
        group = groups.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.groups.GroupsById', method='delete', group_id=group.id), headers=headers)
        assert response.status_code == 400

    def test_groups_endpoint_authentication(self, groups, slack_organizations):
        group = groups.get(slack_organizations[0].team_id)[0]

        response = self.client.get(url_for('api.groups.Groups', method='get'))
        assert response.status_code == 401
        response = self.client.post(url_for('api.groups.Groups', method='post'), json={
            "name": "dontCareName",
            "members": []
        })
        assert response.status_code == 401
        response = self.client.patch(url_for('api.groups.GroupsById', method='patch', group_id=group.id), json={
            "name": "dontCareNameNewName",
        })
        assert response.status_code == 401
        response = self.client.get(url_for('api.groups.GroupsById', method='get', group_id=group.id))
        assert response.status_code == 401
        response = self.client.delete(url_for('api.groups.GroupsById', method='delete', group_id=group.id))
        assert response.status_code == 401
