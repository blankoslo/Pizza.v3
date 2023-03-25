import pytest
import uuid
from flask import url_for
from flask_jwt_extended import create_access_token
from tests.utils import assert_images

@pytest.mark.usefixtures('client_class')
class TestImagesSuit:
    def test_images_get(self, slack_organizations, users, images):
        user = users.get(slack_organizations[0].team_id)
        images = images.get(user.slack_organization_id)

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.images.Images', method='get'), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert len(response_data) == 1
        assert_images(response_images=response_data, images=images)

    def test_images_by_id_get(self, slack_organizations, users, images):
        user = users.get(slack_organizations[0].team_id)
        image = images.get(user.slack_organization_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.images.ImagesById', method='get', image_id=image.cloudinary_id), headers=headers)
        response_data = response.get_json()
        assert response.status_code == 200
        assert_images(response_images=[response_data], images=[image])

    def test_images_by_id_get_not_owned(self, slack_organizations, users, images):
        user = users.get(slack_organizations[0].team_id)
        image = images.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get(url_for('api.images.ImagesById', method='get', image_id=image.cloudinary_id), headers=headers)
        assert response.status_code == 404

    def test_images_by_id_delete(self, slack_organizations, users, images):
        user = users.get(slack_organizations[0].team_id)
        image = images.get(slack_organizations[0].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.images.ImagesById', method='delete', image_id=image.cloudinary_id), headers=headers)
        assert response.status_code == 204

    def test_images_by_id_delete_not_owned(self, slack_organizations, users, images):
        user = users.get(slack_organizations[0].team_id)
        image = images.get(slack_organizations[1].team_id)[0]

        token = create_access_token(identity=user)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.delete(url_for('api.images.ImagesById', method='delete', image_id=image.cloudinary_id), headers=headers)
        assert response.status_code == 400

    def test_images_endpoint_authentication(self, images, slack_organizations):
        image = images.get(slack_organizations[0].team_id)[0]

        response = self.client.get(url_for('api.images.Images', method='get'))
        assert response.status_code == 401
        response = self.client.get(url_for('api.images.ImagesById', method='get', image_id=image.cloudinary_id))
        assert response.status_code == 401
        response = self.client.delete(url_for('api.images.ImagesById', method='delete', image_id=image.cloudinary_id))
        assert response.status_code == 401
