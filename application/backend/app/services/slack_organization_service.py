import logging
import cloudinary.api

from app.repositories.slack_organization_repository import SlackOrganizationRepository


class SlackOrganizationService:
    def __init__(self, logger: logging.Logger):
        self.logger = logger

    def get(self, filters=None, page=None, per_page=None):
        return SlackOrganizationRepository.get(filters=filters, page=page, per_page=per_page)

    def get_by_id(self, team_id):
        return SlackOrganizationRepository.get_by_id(id=team_id)

    def _delete_cloudinary_images_for_slack_organization(self, team_id, next_cursor=None):
        res = cloudinary.api.delete_resources_by_tag(tag=team_id, next_cursor=next_cursor)
        if res['partial']:
            self._delete_cloudinary_images_for_slack_organization(team_id=team_id, next_cursor=res['next_cursor'])

    def delete(self, team_id, enterprise_id=None):
        try:
            self._delete_cloudinary_images_for_slack_organization(team_id=team_id)
            return SlackOrganizationRepository.delete(id=team_id)
        except Exception as e:
            self.logger.error("Failed to delete cloudinary images and or delete organization %s", team_id)
            self.logger.error(e)
        return None

    def upsert(self, schema):
        return SlackOrganizationRepository.upsert(schema=schema)

    def set_channel(self, team_id, channel_id):
        slack_organization = SlackOrganizationRepository.get_by_id(id=team_id)
        old_channel_id = slack_organization.channel_id
        slack_organization.channel_id = channel_id
        return old_channel_id, SlackOrganizationRepository.upsert(schema=slack_organization)
