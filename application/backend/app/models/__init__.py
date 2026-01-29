# Import all models to ensure SQLAlchemy mappers are configured before schemas are created
# Import order matters: base tables and dependencies first, then models that reference them

# Association tables and utilities
from app.models.slack_user_group_association import slack_user_group_association_table

# Base models (no dependencies on other models)
from app.models.slack_organization import SlackOrganization
from app.models.user import User
from app.models.image import Image
from app.models.rating import Rating
from app.models.slack_message import SlackMessage

# Models with dependencies
from app.models.restaurant import Restaurant  # depends on Rating
from app.models.slack_user import SlackUser  # depends on slack_user_group_association_table
from app.models.group import Group  # depends on slack_user_group_association_table
from app.models.event import Event  # depends on Restaurant, Group
from app.models.invitation import Invitation  # depends on Event

__all__ = [
    'slack_user_group_association_table',
    'SlackOrganization',
    'User',
    'Image',
    'Rating',
    'SlackMessage',
    'Restaurant',
    'SlackUser',
    'Group',
    'Event',
    'Invitation',
]
