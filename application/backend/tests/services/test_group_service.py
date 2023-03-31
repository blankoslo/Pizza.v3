import pytest
from app.services.group_service import GroupService
from app.models.group import Group


@pytest.fixture
def group_service():
    return GroupService()


@pytest.mark.usefixtures('client_class')
class TestGroupServiceSuit:
    def test_get(self, slack_organizations, groups, group_service):
        team_id = slack_organizations[0].team_id
        groups = groups.get(team_id)
        test_groups = group_service.get(filters={}, page=1, per_page=10, team_id=team_id)

        sorted_groups = sorted(groups, key=lambda x: x.id)
        sorted_test_groups = sorted(test_groups[1], key=lambda x: x.id)
        for x,y in zip(sorted_groups, sorted_test_groups):
            assert x == y

    def test_get_by_id(self, slack_organizations, groups, group_service):
        team_id = slack_organizations[0].team_id
        group = groups.get(team_id)[0]
        test_group = group_service.get_by_id(group_id=group.id, team_id=team_id)
        assert group == test_group

    def test_add(self, slack_organizations, slack_users, group_service):
        team_id = slack_organizations[0].team_id
        slack_users = slack_users.get(team_id)
        group_service.add(data={'name': 'dontCareName', 'members': [u.slack_id for u in slack_users]}, team_id=team_id)
        test_events = Group.query.all()
        assert len(test_events) == 1

    def test_update(self, db, slack_organizations, groups, slack_users, group_service):
        team_id = slack_organizations[0].team_id
        group = groups.get(team_id)[0]
        slack_users = slack_users.get(team_id)

        group_service.update(group_id=group.id, data={'name': 'dontCareNameNew1', 'members': [u.slack_id for u in slack_users]}, team_id=team_id)

        updated_group = db.session.get(Group, group.id)
        assert updated_group.name == 'dontCareNameNew1'
        assert [u.slack_id for u in updated_group.members] == [u.slack_id for u in slack_users]

    def test_delete(self, db, slack_organizations, groups, group_service):
        team_id = slack_organizations[0].team_id
        group = groups.get(team_id)[0]
        group_id = group.id
        group_service.delete(group_id=group_id, team_id=team_id)
        test_group = db.session.get(Group, group_id)

        assert test_group is None
