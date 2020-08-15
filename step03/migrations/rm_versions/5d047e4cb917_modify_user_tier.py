"""modify user_tier

Revision ID: 5d047e4cb917
Revises: 3b2e4aa45b69
Create Date: 2020-07-18 23:23:19.461217

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table


# revision identifiers, used by Alembic.
revision = '5d047e4cb917'
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

def convert_level_to_tier(level):
    TIER_MAPPING = {
        0: 'noob',
        1: 'beginner',
        2: 'intermediate',
        3: 'advanced',
        4: 'god'
    }

    try:
        return TIER_MAPPING[level]
    except KeyError:
        return -1

def upgrade():
    op.add_column('users', sa.Column('temp_tier', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('user_tier_legacy_3b2e4aa45b69', sa.String(), nullable=True))

    connection = op.get_bind()

    # create temp table
    t_users = table('users',
        sa.Column('username'), 
        sa.Column('user_tier'), 
        sa.Column('temp_tier'),
        sa.Column('user_tier_legacy_3b2e4aa45b69'),
        
    )

    # get all rows from user table to update each users tier
    results = connection.execute(sa.select([
        t_users.c.username, 
        t_users.c.user_tier,
        # t_users.c.temp_tier,
        # t_users.c.user_tier_legacy_3b2e4aa45b69,
        ])).fetchall()

    # update all the records with the integer tier
    for username, user_tier in results:
        connection.execute(
            t_users
                .update()  
                .where(t_users.c.username == username)
                .values(
                    temp_tier=convert_tier_to_level(user_tier),
                    user_tier_legacy_3b2e4aa45b69=user_tier
                    )
        )
    

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('user_tier')


    # put in seperate migration and see how it works
    # rename the column with legacy and the migration id
    # op.alter_column('users','user_tier',
    #     existing_nullable=True,
    #     existing_type=sa.Integer(),
    #     new_column_name='user_tier_legacy_3b2e4aa45b69'
    # )
    # # renaming the temp column to be the new column
    # op.alter_column('users','temp_tier',
    #     existing_nullable=True,
    #     existing_type=sa.Integer(),
    #     new_column_name='user_tier'
    # )
    # op.alter_column('users', 'user_tier',
    #     existing_type=sa.VARCHAR(),
    #     type_=sa.Integer(),
    #     existing_nullable=True
    # )


def downgrade():
    # op.alter_column('users', 'user_tier',
    #     existing_type=sa.Integer(),
    #     type_=sa.VARCHAR(),
    #     existing_nullable=True
    # )
    # with op.batch_alter_table('users') as batch_op:
    #     batch_op.drop_column('temp_tier')

    op.add_column('users', sa.Column('user_tier', sa.String(), nullable=True))

    # bind to the DB
    connection = op.get_bind()

    # create temp table
    t_users = table('users',
        sa.Column('username'), 
        sa.Column('user_tier'), 
        sa.Column('temp_tier'),
        sa.Column('user_tier_legacy_3b2e4aa45b69'),
    )
    # get all rows from user table to update each users tier
    results = connection.execute(sa.select([
        t_users.c.username, 
        # t_users.c.user_tier,
        t_users.c.temp_tier,
        # t_users.c.user_tier_legacy_3b2e4aa45b69,
        ])).fetchall()

    # update all the records with the integer tier
    for username, temp_tier in results:
        connection.execute(
            t_users
                .update()  
                .where(t_users.c.username == username)
                .values(
                    user_tier=convert_level_to_tier(temp_tier),
                    )
        )

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('temp_tier')
        batch_op.drop_column('user_tier_legacy_3b2e4aa45b69')