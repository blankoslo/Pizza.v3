import pytest
from app.models.user import User
from flask_jwt_extended import create_refresh_token, decode_token


@pytest.fixture
def mocked_requests(mocker):
    post_mock = mocker.MagicMock()
    mocker.patch("requests.post", post_mock)
    get_mock = mocker.MagicMock()
    mocker.patch("requests.get", get_mock)
    yield post_mock, get_mock


@pytest.mark.usefixtures('client_class')
class TestAuthSuit:
    def test_refresh(self, slack_organizations, users, ):
        user = users.get(slack_organizations[0].team_id)

        token = create_refresh_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.post('/api/auth/refresh', method='post', headers=headers)
        decoded_token = decode_token(response.get_json()['access_token'])
        assert response.status_code == 200
        assert decoded_token['user']['id'] == user.id

    def test_login(self):
        response = self.client.get('/api/auth/login', method='get')
        response_data = response.get_json()
        auth_url = response_data['auth_url']
        assert response.status_code == 200
        assert isinstance(auth_url, str)

    def test_login_callback_successful(self, db, mocker, mocked_requests, slack_organizations):
        slack_organization = slack_organizations[0]
        slack_provider_cfg_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.get_slack_provider_cfg", slack_provider_cfg_mock)

        auth_client_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.auth.client", auth_client_mock)
        auth_client_mock.prepare_token_request.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()
        auth_client_mock.add_token.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()

        post_mock, get_mock = mocked_requests
        token_response = mocker.Mock()
        token_response.json.return_value = {"access_token": "fake-token"}
        post_mock.return_value = token_response
        userinfo_response = mocker.Mock()
        userinfo_response.json.return_value = {
            "sub": "userId",
            "email": "some@email.invalid",
            "email_verified": True,
            "picture": "https://example.com/picture.jpg",
            "given_name": "someName",
            "https://slack.com/team_id": slack_organization.team_id,
        }
        get_mock.return_value = userinfo_response

        response = self.client.get("/api/auth/login/callback?code=abc123")

        assert response.status_code == 200
        assert decode_token(response.json['access_token'])['user']['id'] == "userId"
        user = db.session.get(User, "userId")
        assert user.email == "some@email.invalid"
        assert user.name == "someName"
        assert user.slack_organization_id == slack_organization.team_id

    def test_login_callback_email_not_verified(self, mocker, mocked_requests, slack_organizations):
        slack_organization = slack_organizations[0]
        slack_provider_cfg_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.get_slack_provider_cfg", slack_provider_cfg_mock)

        auth_client_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.auth.client", auth_client_mock)
        auth_client_mock.prepare_token_request.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()
        auth_client_mock.add_token.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()

        post_mock, get_mock = mocked_requests
        token_response = mocker.Mock()
        token_response.json.return_value = {"access_token": "fake-token"}
        post_mock.return_value = token_response
        userinfo_response = mocker.Mock()
        userinfo_response.json.return_value = {
            "sub": "userId",
            "email": "some@email.invalid",
            "email_verified": False,
            "picture": "https://example.com/picture.jpg",
            "given_name": "someName",
            "https://slack.com/team_id": slack_organization.team_id,
        }
        get_mock.return_value = userinfo_response

        response = self.client.get("/api/auth/login/callback?code=abc123")

        assert response.status_code == 401

    def test_login_callback_slack_organization_not_installed(self, db, mocker, mocked_requests):
        slack_provider_cfg_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.get_slack_provider_cfg", slack_provider_cfg_mock)

        auth_client_mock = mocker.MagicMock()
        mocker.patch("app.api.auth.auth.client", auth_client_mock)
        auth_client_mock.prepare_token_request.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()
        auth_client_mock.add_token.return_value = mocker.MagicMock(), mocker.MagicMock(), mocker.MagicMock()

        post_mock, get_mock = mocked_requests
        token_response = mocker.Mock()
        token_response.json.return_value = {"access_token": "fake-token"}
        post_mock.return_value = token_response
        userinfo_response = mocker.Mock()
        userinfo_response.json.return_value = {
            "sub": "userId",
            "email": "some@email.invalid",
            "email_verified": True,
            "picture": "https://example.com/picture.jpg",
            "given_name": "someName",
            "https://slack.com/team_id": "doesntExistTeamId",
        }
        get_mock.return_value = userinfo_response

        response = self.client.get("/api/auth/login/callback?code=abc123")

        assert response.status_code == 403
