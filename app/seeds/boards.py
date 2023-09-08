from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from faker.providers import lorem
import random

fake = Faker()
fake.add_provider(lorem)

def create_boards(num_boards, num_users):
    for _ in range(num_boards):
        yield Board(
            name = fake.sentence(nb_words=5),
            description = fake.paragraph(nb_sentences=3),
            creatorId = random.randint(1,num_users)
        )

def seed_boards(num_boards, num_users):
    boards = list(create_boards(num_boards, num_users))
    add_boards = [db.session.add(board) for board in boards]
    db.session.commit()
    return boards

def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
    db.session.commit()
