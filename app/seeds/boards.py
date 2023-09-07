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

def seed_boards()
