"""nullable_fields_slack_organizations

Revision ID: 8c1b0067412f
Revises: 87db71f000d7
Create Date: 2023-03-31 20:29:01.227970

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8c1b0067412f'
down_revision = '87db71f000d7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('slack_organizations', 'app_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('slack_organizations', 'bot_user_id',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('slack_organizations', 'access_token',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('slack_organizations', 'access_token',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('slack_organizations', 'bot_user_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('slack_organizations', 'app_id',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###
