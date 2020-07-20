"""change names of columns

Revision ID: 308a837237d7
Revises: 5d047e4cb917
Create Date: 2020-07-19 17:15:45.683708

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table


# revision identifiers, used by Alembic.
revision = '308a837237d7'
down_revision = '5d047e4cb917'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('user_tier', sa.Integer(), nullable=True))

    connection = op.get_bind()

    t_users = table('users',
        sa.Column('username'), 
        sa.Column('temp_tier'),
        sa.Column('user_tier'),
    )

    results = connection.execute(sa.select([
        t_users.c.username,
        t_users.c.temp_tier
    ])).fetchall()

    for username, temp_tier in results:
        connection.execute(
            t_users
                .update()
                .where(t_users.c.username == username)
                .values(user_tier=temp_tier)
        )

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('temp_tier')


def downgrade():
    op.add_column('users', sa.Column('temp_tier', sa.INTEGER(), nullable=True))
    
    connection = op.get_bind()

    t_users = table('users',
        sa.Column('username'), 
        sa.Column('temp_tier'),
        sa.Column('user_tier'),
    )

    results = connection.execute(sa.select([
        t_users.c.username,
        t_users.c.user_tier,
    ])).fetchall()

    for username, user_tier in results:
        connection.execute(
            t_users
                .update()
                .where(t_users.c.username == username)
                .values(temp_tier=user_tier)
        )

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('user_tier')