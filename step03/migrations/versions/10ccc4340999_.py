"""Updating user_tier column

Revision ID: 10ccc4340999
Revises: 3b2e4aa45b69
Create Date: 2020-07-19 20:36:45.270621

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table


# revision identifiers, used by Alembic.
revision = '10ccc4340999'
down_revision = '3b2e4aa45b69'
branch_labels = None
depends_on = None

def convert_tier_to_level(tier):
    TIER_MAPPING = {
        'noob': 0,
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3,
        'god': 4,
    }

    try:
        return TIER_MAPPING[tier]
    except KeyError:
        return -1

def upgrade():
    try: 
        op.add_column('users', 
            sa.Column(
                'temp_tier', 
                sa.Integer(), 
                nullable=True
            )
        )
    except:
        print('Unexpected migration error...')
        raise
    
    connection = op.get_bind()

    # create temp table for modifications
    t_users = table('users',
        sa.Column('username'), 
        sa.Column('user_tier'), 
        sa.Column('temp_tier'),
    )

    # get all rows from user table to update each users tier
    results = connection.execute(sa.select([
        t_users.c.username, 
        t_users.c.user_tier
        ])).fetchall()

    # update all the records with the new tier column
    for username, user_tier in results:
        connection.execute(
            t_users
                .update()  
                .where(t_users.c.username == username)
                .values(temp_tier=convert_tier_to_level(user_tier))
        )
    
    # rename temp_tier column and user_tier_legacy column
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('user_tier', 
            new_column_name='user_tier_legacy_3b2e4aa45b69'
        )
        batch_op.alter_column('temp_tier', 
            new_column_name='user_tier'
        )

def downgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('user_tier')
        batch_op.alter_column('user_tier_legacy_3b2e4aa45b69',
            new_column_name='user_tier'
        )

