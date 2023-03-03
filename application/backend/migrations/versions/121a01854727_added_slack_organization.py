"""added slack organization

Revision ID: 121a01854727
Revises: a78911713d44
Create Date: 2023-03-03 10:50:12.388482

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '121a01854727'
down_revision = 'a78911713d44'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('slack_organizations',
    sa.Column('team_id', sa.String(), nullable=False),
    sa.Column('team_name', sa.String(), nullable=True),
    sa.Column('enterprise_id', sa.String(), nullable=True),
    sa.Column('enterprise_name', sa.String(), nullable=True),
    sa.Column('app_id', sa.String(), nullable=True),
    sa.Column('bot_user_id', sa.String(), nullable=True),
    sa.Column('access_token', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('team_id')
    )
    op.add_column('events', sa.Column('slack_organization_id', sa.String(), nullable=True))
    op.create_foreign_key(None, 'events', 'slack_organizations', ['slack_organization_id'], ['team_id'])
    op.add_column('restaurants', sa.Column('slack_organization_id', sa.String(), nullable=True))
    op.create_foreign_key(None, 'restaurants', 'slack_organizations', ['slack_organization_id'], ['team_id'])
    op.add_column('slack_users', sa.Column('slack_organization_id', sa.String(), nullable=True))
    op.create_foreign_key(None, 'slack_users', 'slack_organizations', ['slack_organization_id'], ['team_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'slack_users', type_='foreignkey')
    op.drop_column('slack_users', 'slack_organization_id')
    op.drop_constraint(None, 'restaurants', type_='foreignkey')
    op.drop_column('restaurants', 'slack_organization_id')
    op.drop_constraint(None, 'events', type_='foreignkey')
    op.drop_column('events', 'slack_organization_id')
    op.drop_table('slack_organizations')
    # ### end Alembic commands ###
