import pytest
import uuid
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_events


@pytest.mark.usefixtures('client_class')
class TestEventsSuit:
    def test_events_get(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        events = events.get(user.slack_organization_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.events.Events', method='get'), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 2
        assert_events(response_events=response_data, events=events)

    def test_events_post_no_group(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(user.slack_organization_id)[0].id,
            "time": "2023-03-28T16:23:05.420Z",
            "people_per_event": 5
        }
        response = self.client.post(url_for('api.events.Events', method='post'), headers=headers, json=payload)
        assert response.status_code == 201

    def test_events_post_group(self, slack_organizations, users, restaurants, groups):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(user.slack_organization_id)[0].id,
            "group_id": groups.get(user.slack_organization_id)[0].id,
            "time": "2023-03-28T16:23:05.420Z",
            "people_per_event": 5
        }
        response = self.client.post(url_for('api.events.Events', method='post'), headers=headers, json=payload)
        assert response.status_code == 201

    def test_events_post_not_owned_restaurant(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(slack_organizations[1].team_id)[0].id,
            "time": "2023-03-28T16:23:05.420Z",
            "people_per_event": 5
        }
        response = self.client.post(url_for('api.events.Events', method='post'), headers=headers, json=payload)
        assert response.status_code == 400

    def test_events_post_not_owned_group(self, slack_organizations, users, restaurants, groups):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(user.slack_organization_id)[0].id,
            "time": "2023-03-28T16:23:05.420Z",
            "people_per_event": 5,
            "group_id": groups.get(slack_organizations[1].team_id)[0].id,
        }
        response = self.client.post(url_for('api.events.Events', method='post'), headers=headers, json=payload)
        assert response.status_code == 400

    def test_events_by_id_get(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.events.EventsById', method='get', event_id=event.id), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert_events([response_data], [event])

    def test_events_by_id_get_not_owned(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.events.EventsById', method='get', event_id=event.id), headers=headers)
        assert response.status_code == 404

    def test_events_by_id_patch_restaurant(self, slack_organizations, users, events, restaurants):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(user.slack_organization_id)[1].id,
        }
        response = self.client.patch(url_for('api.events.EventsById', method='patch', event_id=event.id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_events_by_id_patch_time(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "time": "2023-04-25T16:23:05.420Z",
        }
        response = self.client.patch(url_for('api.events.EventsById', method='patch', event_id=event.id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_events_by_id_patch_not_owned(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "time": "2023-04-25T16:23:05.420Z",
        }
        response = self.client.patch(url_for('api.events.EventsById', method='patch', event_id=event.id), headers=headers, json=payload)
        assert response.status_code == 404

    def test_events_by_id_patch_restaurant_not_owned(self, slack_organizations, users, events, restaurants):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "restaurant_id": restaurants.get(slack_organizations[1].team_id)[0].id,
        }
        response = self.client.patch(url_for('api.events.EventsById', method='patch', event_id=event.id), headers=headers, json=payload)
        assert response.status_code == 404

    def test_events_by_id_delete(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.events.EventsById', method='delete', event_id=event.id), headers=headers)
        assert response.status_code == 204

    def test_events_by_id_delete_not_owned(self, slack_organizations, users, events):
        user = users.get(slack_organizations[0].team_id)
        event = events.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.events.EventsById', method='delete', event_id=event.id), headers=headers)
        assert response.status_code == 400

    def test_events_endpoint_authentication(self, events, slack_organizations):
        event = events.get(slack_organizations[0].team_id)[0]

        response = self.client.get(url_for('api.events.Events', method='get'))
        assert response.status_code == 401
        response = self.client.post(url_for('api.events.Events', method='post'), json={
            "restaurant_id": uuid.uuid4(),
            "time": "2023-03-28T16:23:05.420Z",
            "people_per_event": 5
        })
        assert response.status_code == 401
        response = self.client.patch(url_for('api.events.EventsById', method='patch', event_id=event.id), json={
            "time": "2023-04-25T16:23:05.420Z",
        })
        assert response.status_code == 401
        response = self.client.get(url_for('api.events.EventsById', method='get', event_id=event.id))
        assert response.status_code == 401
        response = self.client.delete(url_for('api.events.EventsById', method='delete', event_id=event.id))
        assert response.status_code == 401
