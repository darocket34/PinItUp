from .db import db, environment, SCHEMA, add_prefix_for_prod
from .board_pins import board_pins
from sqlalchemy import desc
from .pin import Pin


class Board(db.Model):
    __tablename__ = "boards"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    creatorId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    user = db.relationship("User", back_populates="board")
    pins = db.relationship("Pin", secondary=board_pins, back_populates="board", order_by=lambda: desc(Pin.id))

    def get_preview_pin(self):
        if self.pins:
            return self.pins[0].to_dict()
        else:
            return None

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "creatorId": self.creatorId,
            "pins": [pin.to_dict() for pin in self.pins],
            "previewPin": self.get_preview_pin()
        }
