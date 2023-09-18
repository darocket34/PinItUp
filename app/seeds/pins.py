from app.models import db, Pin, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from faker.providers import lorem, date_time, person
import random

fake = Faker()
fake.add_provider(date_time)
fake.add_provider(lorem)
fake.add_provider(person)

def create_pins(num_pins, num_users):
    for _ in range(num_pins):
        yield Pin(
            name = fake.sentence(nb_words=5),
            description = fake.paragraph(nb_sentences=4),
            url = f'https://picsum.photos/{random.randint(600,1000)}/{random.randint(600,1000)}.jpg?random={random.randint(1,100)}',
            creatorId = random.randint(1, num_users),
            postDate = fake.date_this_year()
        )


def seed_pins(num_pins, num_users):
    pins = list(create_pins(num_pins, num_users))
    add_pins = [db.session.add(pin) for pin in pins]
    db.session.commit()
    return pins

def undo_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pins RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.board_pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pins"))
        db.session.execute(text("DELETE FROM board_pins"))
    db.session.commit()
