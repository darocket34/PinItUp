"""empty message

Revision ID: 4482af14f1aa
Revises: 5d77e1a9271e
Create Date: 2023-09-09 15:07:35.674316

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4482af14f1aa'
down_revision = '5d77e1a9271e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column('date', sa.Date(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('comments', 'date')
    # ### end Alembic commands ###
