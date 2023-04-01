import pytest
from app.models.slack_organization import SlackOrganization


@pytest.mark.usefixtures('client_class')
class TestSlackSuit:
    def test_install(self, app):
        response = self.client.get('/api/slack/install', method='get')
        response_data = response.get_json()
        redirect_url = response_data['redirect_url']
        assert response.status_code == 200
        assert redirect_url == f'https://slack.com/oauth/v2/authorize?scope=channels:read,channels:history,' \
                               f'channels:join,channels:manage,groups:read,chat:write,files:read,im:history,im:write,' \
                               f'users:read,users:read.email,commands&client_id=' \
                               f'{app.config["SLACK_CLIENT_ID"]}&redirect_uri=' \
                               f'{app.config["FRONTEND_URI"]}/slack/callback'

    def test_callback(self, db, mock_broker, mocker):
        # Mock requests post
        requests_mocker = mocker.MagicMock()
        mocker.patch('app.api.slack.requests.post', requests_mocker)
        # Mock requests post function call return value
        requests_post_mock = mocker.MagicMock()
        requests_mocker.return_value = requests_post_mock
        # Mock requests posts function call json call return value
        requests_post_mock.json.return_value = {
            'ok': True,
            'is_enterprise_install': False,
            'team': {
                'id': 'dontCareNewTeamId',
                'name': 'dontCareNewTeamName'
            },
            'app_id': 'dontCareAppId',
            'bot_user_id': 'dontCareUserId',
            'access_token': 'dontCareAccessToken'
        }

        response = self.client.post('/api/slack/callback', method='post', json={'code': 'dontCareCode'})

        test_slack_organization = db.session.query(SlackOrganization).get('dontCareNewTeamId')

        assert test_slack_organization is not None
        mock_broker.send.assert_called()
        assert len(mock_broker.send.call_args_list) == 1
        assert mock_broker.send.call_args_list[0].kwargs['body']['type'] == 'new_slack_organization_event'
        assert response.status_code == 200
