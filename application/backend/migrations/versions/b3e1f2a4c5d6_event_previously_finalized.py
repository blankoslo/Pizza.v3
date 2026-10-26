"""event previously finalized

Revision ID: b3e1f2a4c5d6
Revises: 8c1b0067412f
Create Date: 2026-10-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3e1f2a4c5d6'
down_revision = '8c1b0067412f'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('events', sa.Column('previously_finalized', sa.Boolean(), server_default='f', nullable=False))


def downgrade():
    op.drop_column('events', 'previously_finalized')
