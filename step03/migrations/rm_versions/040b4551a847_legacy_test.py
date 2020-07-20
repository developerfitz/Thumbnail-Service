"""legacy test

Revision ID: 040b4551a847
Revises: 308a837237d7
Create Date: 2020-07-19 19:38:39.555596

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '040b4551a847'
down_revision = '308a837237d7'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('user_tier_legacy_3b2e4aa45b69',              
            new_column_name='legacy_user_tier'
        )


def downgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('legacy_user_tier',              
            new_column_name='user_tier_legacy_3b2e4aa45b69'
        )

