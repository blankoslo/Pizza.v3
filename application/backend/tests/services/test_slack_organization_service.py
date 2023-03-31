import pytest
from app.services.slack_organization_service import SlackOrganizationService
from app.models.slack_organization import SlackOrganization

@pytest.fixture
def slack_organization_service(mocker):
    logging_mock = mocker.MagicMock()()
    return SlackOrganizationService(logger=logging_mock)


@pytest.mark.usefixtures('client_class')
class TestSlackOrganizationServiceSuit:
    def test_get(self, mocker, slack_organizations, slack_organization_service):
        test_slack_organizations = slack_organization_service.get()

        sorted_slack_organizations = sorted(slack_organizations, key=lambda x: x.team_id)
        sorted_test_slack_organizations = sorted(test_slack_organizations[1], key=lambda x: x.team_id)
        for x,y in zip(sorted_slack_organizations, sorted_test_slack_organizations):
            assert x == y

    def test_get_by_id(self, slack_organizations, slack_organization_service):
        slack_organization = slack_organizations[0]
        test_slack_organization = slack_organization_service.get_by_id(team_id=slack_organization.team_id)
        assert slack_organization == test_slack_organization

    def test_delete(self, db, mocker, slack_organizations, slack_organization_service):
        slack_organization = slack_organizations[0]

        cloudinary_mock = mocker.MagicMock()

        def delete_resources_by_tag_side_effect(tag, next_cursor):
            return {'partial': False}
        delete_resources_by_tag = mocker.MagicMock()
        delete_resources_by_tag.side_effect = delete_resources_by_tag_side_effect
        cloudinary_mock.delete_resources_by_tag = delete_resources_by_tag

        mocker.patch("cloudinary.api", cloudinary_mock)
        team_id = slack_organization.team_id
        slack_organization_service.delete(team_id=team_id)

        deleted_slack_organization = db.session.get(SlackOrganization, team_id)
        assert deleted_slack_organization is None
        cloudinary_mock.delete_resources_by_tag.assert_called_once()
        assert len(cloudinary_mock.delete_resources_by_tag.call_args_list) == 1
        assert cloudinary_mock.delete_resources_by_tag.call_args_list[0].kwargs['tag'] == team_id

    def test_upsert(self, db, slack_organization_service):

        new_slack_organization = SlackOrganization(
            team_id="dontCareNewTeamId",
            app_id="dontCareAppId",
            bot_user_id="dontCareBotUserId",
            access_token="dontCareAccessToken"
        )

        slack_organization_service.upsert(new_slack_organization)

        test_new_slack_organization = db.session.get(SlackOrganization, new_slack_organization.team_id)
        assert new_slack_organization == test_new_slack_organization

    def test_set_channel(self, db, slack_organizations, slack_organization_service):
        slack_organization = slack_organizations[0]

        slack_organization_service.set_channel(team_id=slack_organization.team_id, channel_id="newDontCareChannelId")

        test_new_slack_organization = db.session.get(SlackOrganization, slack_organization.team_id)
        assert test_new_slack_organization.channel_id == "newDontCareChannelId"
