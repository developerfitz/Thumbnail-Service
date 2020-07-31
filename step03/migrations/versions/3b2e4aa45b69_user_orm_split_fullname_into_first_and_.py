"""user ORM: added first and last

Revision ID: 3b2e4aa45b69
Revises: 337811a3f6b0
Create Date: 2020-07-18 18:53:27.989200

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table


# revision identifiers, used by Alembic.
revision = '3b2e4aa45b69'
down_revision = '337811a3f6b0'
branch_labels = None
depends_on = None


def upgrade():
    try:
        op.add_column('users', 
            sa.Column(
                'first_name', 
                sa.String(), 
                nullable=True
            )
        )
        op.add_column('users', 
            sa.Column(
                'last_name', 
                sa.String(), 
                nullable=True
            )
        )
    except:
        print('Unexpected migration error...')
        raise

    connection = op.get_bind()

    t_users = table(
        'users',
        sa.Column('username'),
        sa.Column('fullname'),
        sa.Column('first_name'),
        sa.Column('last_name'),
    )

    # SELECT username, fullname FROM users
    results = connection.execute(sa.select([
        t_users.c.username,
        t_users.c.fullname,
    ])).fetchall()

    # UPDATE users SET first_name = x, last_name = y WHERE username = z
    for username, fullname in results:
        first_name, last_name = fullname.rsplit(' ', 1)
        connection.execute(
            t_users
                .update()
                .where(t_users.c.username == username)
                .values(
                    last_name=last_name,
                    first_name=first_name,
                )
        )

def downgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
