from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
from faker.providers import profile, date_time
import random

fake = Faker()
fake.add_provider(profile)
fake.add_provider(date_time)

def create_users(num_users):
    sample_size = num_users // 5 * 4
    for _ in range(num_users):
        personObj = fake.simple_profile()
        yield User(
            name = personObj['name'],
            username = personObj['username'],
            email = personObj['mail'],
            birthday = personObj['birthdate'],
            password = 'password',
            profile_img = f'https://picsum.photos/250.jpg?random={random.randint(1,100)}'
        )

# Adds a demo user, you can add other users here if you want
def seed_users(num_users):
    demo = User(
        name = fake.name(), username='Demo', email='demo@aa.io', password='password', birthday = fake.date_of_birth(), profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')
    marnie = User(
        name = fake.name(), username='marnie', email='marnie@aa.io', password='password', birthday = fake.date_of_birth(), profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')
    bobbie = User(
        name = fake.name(), username='bobbie', email='bobbie@aa.io', password='password', birthday = fake.date_of_birth(), profile_img=f'https://picsum.photos/250.jpg?random={random.randint(1,100)}')

    new_users = list(create_users(num_users))
    initial_users = [demo, marnie, bobbie]
    for user in initial_users:
        new_users.append(user)
    add_users = [db.session.add(user) for user in new_users]
    db.session.commit()
    all_users = User.query.all()

    for user in all_users:
        follower_count = random.randint(0, num_users // 5)
        follower_list = random.sample(all_users, follower_count)
        # follower_ids = [follower.id for follower in follower_list]
        follower_ids = []
        for follower in follower_list:
            if (follower.id != user.id):
                follower_ids.append(follower.id)
        user.followers.extend(User.query.filter(User.id.in_(follower_ids)))
        print("USER-------------------------------------", follower_ids)
    db.session.commit()

    return len(User.query.all())


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
