from app.models import db, Board, environment, SCHEMA
from faker import Faker
from faker.providers import lorem, date_time
import random

fake = Faker()
fake.provider(lorem)

def create_boards(num_boards):
    for _ in range(num_boards):
        yield Board(
            name = fake.sentence(nb_words=8),
            description = fake.paragraph(nb_sentences=4),
            creatorId = random.randint(1,40)
        )

def seed_boards(num_boards):
    boards = list(create_boards(num_boards))
    add_boards = [db.session.add(board) for board in boards]
    db.session.commit()
    return boards

def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))
