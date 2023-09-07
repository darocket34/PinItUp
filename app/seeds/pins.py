from app.models import db, Pin, environment, SCHEMA
from faker import Faker
from faker.providers import lorem, date_time
import random

fake = Faker()
fake.provider(profile)
fake.provider(lorem)

def create_pins(num_pins):
    for _ in range(num_pins):
        personObj = fake.simple_profile()
        yield Pin(
            name = fake.sentence(nb_words=10, variable_nb_words=False),
            description = fake.paragraphs(nb_sentences=5),
            url = f'https://picsum.photos/250.jpg?random={random.randint(1,100)}',
            creatorId = random.randint(1,40),
            postDate = personObj.birthdate
        )


def seed_pins(num_pins):
    pins = list(create_pins(num_pins))
    add_pins = [db.session.add(pin) for pin in pins]
    db.session.commit()
    return pins

def undo_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pins"))
