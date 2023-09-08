"""empty message

Revision ID: 3bbc58f01ae9
Revises: 
Create Date: 2023-09-07 17:19:10.307161

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3bbc58f01ae9'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('birthday', sa.Date(), nullable=True),
    sa.Column('profile_img', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('boards',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=False),
    sa.Column('description', sa.String(length=200), nullable=False),
    sa.Column('creatorId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['creatorId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=40), nullable=False),
    sa.Column('description', sa.String(length=200), nullable=False),
    sa.Column('url', sa.String(length=255), nullable=True),
    sa.Column('creatorId', sa.Integer(), nullable=False),
    sa.Column('postDate', sa.Date(), nullable=False),
    sa.Column('boardId', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['boardId'], ['boards.id'], ),
    sa.ForeignKeyConstraint(['creatorId'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creatorId', sa.Integer(), nullable=False),
    sa.Column('pinId', sa.Integer(), nullable=False),
    sa.Column('comment', sa.String(length=150), nullable=False),
    sa.ForeignKeyConstraint(['creatorId'], ['users.id'], ),
    sa.ForeignKeyConstraint(['pinId'], ['pins.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('comments')
    op.drop_table('pins')
    op.drop_table('boards')
    op.drop_table('users')
    # ### end Alembic commands ###
