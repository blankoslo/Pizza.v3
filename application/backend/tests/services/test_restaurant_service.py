import pytest
from app.services.restaurant_service import RestaurantService
from app.models.restaurant import Restaurant

@pytest.fixture
def restaurant_service():
    return RestaurantService()


@pytest.mark.usefixtures('client_class')
class TestRestaurantServiceSuit:
    def test_get(self, slack_organizations, restaurants, restaurant_service):
        team_id = slack_organizations[0].team_id
        restaurants = restaurants.get(team_id)
        test_restaurants = restaurant_service.get(filters={}, page=1, per_page=10, team_id=team_id)

        sorted_restaurants = sorted(restaurants, key=lambda x: x.id)
        sorted_test_restaurants = sorted(test_restaurants[1], key=lambda x: x.id)
        for x,y in zip(sorted_restaurants, sorted_test_restaurants):
            assert x == y

    def test_get_by_id(self, slack_organizations, restaurants, restaurant_service):
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]
        test_restaurant = restaurant_service.get_by_id(restaurant_id=restaurant.id, team_id=team_id)
        assert restaurant == test_restaurant

    def test_add(self, slack_organizations, restaurant_service):
        team_id = slack_organizations[0].team_id
        new_restaurant = Restaurant(
            name="dontCareName",
            link="dontCareLink",
            tlf="dontCareTlf",
            address="dontCareAddress"
        )
        restaurant_service.add(data=new_restaurant, team_id=team_id)
        test_restaurants = Restaurant.query.all()
        assert len(test_restaurants) == 1

    def test_update(self, slack_organizations, restaurants, restaurant_service):
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]

        update_data = {
            "name": "dontCareNewName",
            "link": "dontCareNewLink",
            "tlf": "dontCareNewTlf",
            "address": "dontCareNewAddress"
        }
        restaurant_service.update(restaurant_id=restaurant.id, data=update_data, team_id=team_id)

        updated_restaurant = Restaurant.query.get(restaurant.id)
        assert updated_restaurant.name == "dontCareNewName"
        assert updated_restaurant.link == "dontCareNewLink"
        assert updated_restaurant.tlf == "dontCareNewTlf"
        assert updated_restaurant.address == "dontCareNewAddress"


    def test_delete(self, slack_organizations, restaurants, restaurant_service):
        team_id = slack_organizations[0].team_id
        restaurant = restaurants.get(team_id)[0]

        result = restaurant_service.delete(restaurant_id=restaurant.id, team_id=team_id)

        test_restaurant = restaurant.query.with_deleted().get(restaurant.id)
        assert result is True
        assert test_restaurant.deleted is True
