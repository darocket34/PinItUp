from .db import db, environment, SCHEMA, add_prefix_for_prod
from .board_pins import board_pins

class Pin(db.Model):
    __tablename__ = "pins"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(255))
    creatorId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    postDate = db.Column(db.Date, nullable=False)

    board_pin = db.relationship(
    "Board",
    secondary=board_pins,
    back_populates="pin_board",
    )

    comments = db.relationship("Comment", back_populates="pin")
    user = db.relationship("User", back_populates="pins")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "creatorId": self.creatorId,
            "postDate": self.postDate,
            "likes": self.likes
        }
