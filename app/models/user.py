from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .follows_table import follows_table

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    birthday = db.Column(db.Date)
    profile_img = db.Column(db.String(255))

    board = db.relationship("Board", back_populates="user")
    pins = db.relationship("Pin", back_populates="user")
    comments = db.relationship("Comment", back_populates="user")
    followers = db.relationship(
        "User",
        secondary = follows_table,
        primaryjoin = (id == follows_table.c.followingId),
        secondaryjoin = (id == follows_table.c.followerId),
        backref = db.backref("following", lazy = "dynamic"),
        lazy = "dynamic"
        )


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'birthday': self.birthday,
            'name': self.name,
            'profile_img': self.profile_img,

            'following': [follow.to_dict_simplified() for follow in self.following],
            'followers': [follow.to_dict_simplified() for follow in self.followers]
        }

    def to_dict_simplified(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'birthday': self.birthday,
            'name': self.name,
            'profile_img': self.profile_img,
        }
