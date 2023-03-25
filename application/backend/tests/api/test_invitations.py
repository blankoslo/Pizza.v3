import pytest
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_invitations


@pytest.mark.usefixtures('client_class')
class TestInvitationsSuit:
    def test_invitations_get(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitations = invitations.get(user.slack_organization_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(
            url_for(
                'api.invitations.Invitations',
                method='get'
            ),
            headers=headers
        )
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 2
        assert_invitations(response_invitations=response_data, invitations=invitations)

    def test_invitations_get_by_event_id(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(user.slack_organization_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(
            url_for(
                'api.invitations.InvitationsByEventId',
                method='get',
                event_id=invitation.event_id
            ),
            headers=headers
        )
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 1
        assert_invitations(response_invitations=response_data, invitations=[invitation])

    def test_invitations_get_by_event_id_not_owned(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(
            url_for(
                'api.invitations.InvitationsByEventId',
                method='get',
                event_id=invitation.event_id
            ),
            headers=headers
        )
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 0

    def test_invitations_get_by_event_and_slack_id(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(user.slack_organization_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(
            url_for(
                'api.invitations.InvitationsByEventAndUserId',
                method='get',
                event_id=invitation.event_id,
                user_id=invitation.slack_id
            ),
            headers=headers
        )
        response_data = response.get_json()
        assert response.status_code == 200
        assert_invitations(response_invitations=[response_data], invitations=[invitation])

    def test_invitations_get_by_event_and_slack_id_not_owned(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(
            url_for(
                'api.invitations.InvitationsByEventAndUserId',
                method='get',
                event_id=invitation.event_id,
                user_id=invitation.slack_id
            ),
            headers=headers
        )
        assert response.status_code == 404

    def test_invitations_put(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(user.slack_organization_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "rsvp": "attending"
        }
        response = self.client.put(
            url_for(
                'api.invitations.InvitationsByEventAndUserId',
                method='put',
                event_id=invitation.event_id,
                user_id=invitation.slack_id
            ),
            headers=headers,
            json=payload
        )
        assert response.status_code == 200

    def test_invitations_put_not_owned(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "rsvp": "attending"
        }
        response = self.client.put(
            url_for(
                'api.invitations.InvitationsByEventAndUserId',
                method='put',
                event_id=invitation.event_id,
                user_id=invitation.slack_id
            ),
            headers=headers,
            json=payload
        )
        assert response.status_code == 404

    def test_invitations_endpoint_authentication(self, slack_organizations, users, invitations):
        user = users.get(slack_organizations[0].team_id)
        invitation = invitations.get(user.slack_organization_id)[0]

        response = self.client.get(url_for('api.invitations.Invitations', method='get'))
        assert response.status_code == 401
        response = self.client.get(url_for('api.invitations.InvitationsByEventId', method='get', event_id=invitation.event_id))
        assert response.status_code == 401
        response = self.client.get(url_for('api.invitations.InvitationsByEventAndUserId', method='get', event_id=invitation.event_id, user_id=invitation.slack_id))
        assert response.status_code == 401
        response = self.client.put(url_for('api.invitations.InvitationsByEventAndUserId', method='put', event_id=invitation.event_id, user_id=invitation.slack_id), json={
                "rsvp": "attending"
        })
        assert response.status_code == 401
