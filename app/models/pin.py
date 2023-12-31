from .db import db, environment, SCHEMA, add_prefix_for_prod
from .comment import Comment
from sqlalchemy import desc
from .board_pins import board_pins

class Pin(db.Model):
    __tablename__ = "pins"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(255))
    creatorId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    postDate = db.Column(db.Date, nullable=False)
    boardId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")))

    comments = db.relationship("Comment", back_populates="pin", order_by=lambda: desc(Comment.date), cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="pins")
    board = db.relationship("Board", secondary=board_pins, back_populates="pins")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "creatorId": self.creatorId,
            "postDate": self.postDate,
            "boardId": self.boardId,
            "comments": [comment.to_dict() for comment in sorted(self.comments, key=lambda comment: comment.date)]
        }

    def to_dict_simplified(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "creatorId": self.creatorId,
            "postDate": self.postDate
        }
