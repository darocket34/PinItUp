from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from faker.providers import person, internet, date_time
import random

fake = Faker()
fake.add_provider(profile)

def create_users(num_users):
    for _ in range(num_users):
        personObj = fake.simple_profile()
        yield User(
            name = personObj.name,
            username = personObj.username,
            email = personObj.mail,
            birthday = personObj.birthdate,
            password = 'password',
            profile_img = f'https://picsum.photos/250.jpg?random={random.randint(1,100)}'
        )

# Adds a demo user, you can add other users here if you want
def seed_users(num_users):
    demo = User(
        name = personObj.name, username='Demo', email='demo@aa.io', password='password', birthday = personObj.birthdate, profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')
    marnie = User(
        name = personObj.name, username='marnie', email='marnie@aa.io', password='password', birthday = personObj.birthdate, profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')
    bobbie = User(
        name = personObj.name, username='bobbie', email='bobbie@aa.io', password='password', birthday = personObj.birthdate, profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')

    new_users = list(create_users(num_users))
    add_users = [db.session.add(user) for user in new_users]
    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
