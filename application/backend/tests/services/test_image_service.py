import pytest
from datetime import datetime
from app.services.image_service import ImageService
from app.models.image import Image

@pytest.fixture
def image_service():
    return ImageService()


@pytest.mark.usefixtures('client_class')
class TestImageServiceSuit:
    def test_get(self, slack_organizations, images, image_service):
        team_id = slack_organizations[0].team_id
        images = images.get(team_id)
        test_images = image_service.get(filters={}, page=1, per_page=10, order_by=None, team_id=team_id)

        sorted_images = sorted(images, key=lambda x: x.cloudinary_id)
        sorted_test_images = sorted(test_images[1], key=lambda x: x.cloudinary_id)
        for x,y in zip(sorted_images, sorted_test_images):
            assert x == y

    def test_get_by_id(self, slack_organizations, images, image_service):
        team_id = slack_organizations[0].team_id
        image = images.get(team_id)[0]
        test_image = image_service.get_by_id(image_id=image.cloudinary_id, team_id=team_id)
        assert image == test_image

    def test_delete(self, slack_organizations, images, image_service):
        team_id = slack_organizations[0].team_id
        image = images.get(team_id)[0]
        image_service.delete(image_id=image.cloudinary_id, team_id=team_id)
        test_image = Image.query.get(image.cloudinary_id)

        assert test_image is None

    def test_add(self, slack_organizations, slack_users, image_service):
        team_id = slack_organizations[0].team_id
        slack_user = slack_users.get(team_id)[0]

        data = {
            "cloudinary_id": "dontCareCloudinaryId",
            "uploaded_by_id": slack_user.slack_id,
            "uploaded_at": datetime.today().isoformat(),
            "title": "dontCareImageTitle"
        }
        image_service.add(data=data, team_id=team_id)

        test_images = Image.query.all()
        assert len(test_images) == 1
