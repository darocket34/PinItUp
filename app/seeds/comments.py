from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from faker.providers import lorem, date_time
import random

fake = Faker()
fake.add_provider(lorem)
fake.add_provider(date_time)

def create_comments(num_comments, num_users, num_pins):
    for _ in range(num_comments):
        yield Comment(
            creatorId = random.randint(1,num_users),
            pinId = random.randint(1, num_pins),
            comment = fake.sentence(nb_words=10),
            date = fake.date_time_this_year()
        )

def seed_comments(num_comments, num_users, num_pins):
    comments = list(create_comments(num_comments, num_users, num_pins))
    add_comments = [db.session.add(comment) for comment in comments]
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
    db.session.commit()
