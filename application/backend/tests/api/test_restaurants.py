import pytest
import uuid
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_restaurants


@pytest.mark.usefixtures('client_class')
class TestRestaurantsSuit:
    def test_restaurants_get(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurants = restaurants.get(user.slack_organization_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.restaurants.Restaurants', method='get'), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 2
        assert_restaurants(response_restaurants=response_data, restaurants=restaurants)

    def test_restaurants_post(self, slack_organizations, users):
        user = users.get(slack_organizations[0].team_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "dontCareName"
        }
        response = self.client.post(url_for('api.restaurants.Restaurants', method='post'), headers=headers, json=payload)
        assert response.status_code == 201

    def test_restaurants_by_id_get(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.restaurants.RestaurantsById', method='get', restaurant_id=restaurant.id), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert_restaurants([response_data], [restaurant])

    def test_restaurants_by_id_get_not_owned(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.restaurants.RestaurantsById', method='get', restaurant_id=restaurant.id), headers=headers)
        assert response.status_code == 404

    def test_restaurants_by_id_put(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "dontCareNewName",
            "address": None,
            "tlf": None,
            "link": None
        }
        response = self.client.put(url_for('api.restaurants.RestaurantsById', method='put', restaurant_id=restaurant.id), headers=headers, json=payload)
        assert response.status_code == 200

    def test_events_by_id_put_not_owned(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": "dontCareNewName",
            "address": None,
            "tlf": None,
            "link": None
        }
        response = self.client.put(url_for('api.restaurants.RestaurantsById', method='put', restaurant_id=restaurant.id), headers=headers, json=payload)
        print(response.get_json())
        assert response.status_code == 404

    def test_restaurants_by_id_delete(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.restaurants.RestaurantsById', method='delete', restaurant_id=restaurant.id), headers=headers)
        assert response.status_code == 204

    def test_restaurants_by_id_delete_not_owned(self, slack_organizations, users, restaurants):
        user = users.get(slack_organizations[0].team_id)
        restaurant = restaurants.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.restaurants.RestaurantsById', method='delete', restaurant_id=restaurant.id), headers=headers)
        assert response.status_code == 404

    def test_restaurants_endpoint_authentication(self, restaurants, slack_organizations):
        restaurant = restaurants.get(slack_organizations[0].team_id)[0]

        response = self.client.get(url_for('api.restaurants.Restaurants', method='get'))
        assert response.status_code == 401
        response = self.client.post(url_for('api.restaurants.Restaurants', method='post'), json={
            "name": "dontCareName"
        })
        assert response.status_code == 401
        response = self.client.put(url_for('api.restaurants.RestaurantsById', method='put', restaurant_id=restaurant.id), json={
            "name": "dontCareNewName",
            "address": None,
            "tlf": None,
            "link": None
        })
        assert response.status_code == 401
        response = self.client.get(url_for('api.restaurants.RestaurantsById', method='get', restaurant_id=restaurant.id))
        assert response.status_code == 401
        response = self.client.delete(url_for('api.restaurants.RestaurantsById', method='delete', restaurant_id=restaurant.id))
        assert response.status_code == 401
