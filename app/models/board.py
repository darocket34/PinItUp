from .db import db, environment, SCHEMA, add_prefix_for_prod
from .board_pins import board_pins

class Board(db.Model):
    __tablename__ = "boards"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    creatorId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    user = db.relationship("User", back_populates="board")
    pins = db.relationship("Pin", secondary=board_pins, back_populates="board")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "creatorId": self.creatorId,
        }
