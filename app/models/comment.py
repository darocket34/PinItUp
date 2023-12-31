from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    creatorId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    pinId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")), nullable=False)
    comment = db.Column(db.String(250), nullable=False)
    date = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="comments")
    pin = db.relationship("Pin", back_populates="comments")


    def to_dict(self):
        return {
            "id": self.id,
            "creatorId": self.creatorId,
            "pinId": self.pinId,
            "comment": self.comment,
            "date": self.date,
        }
