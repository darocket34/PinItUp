from .db import db, environment, SCHEMA, add_prefix_for_prod

board_pins = db.Table(
  "follows",
  db.Model.metadata,
  db.Column("followerId", db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), primary_key=True),
  db.Column("followingId", db.Integer, db.ForeignKey(add_prefix_for_prod("user.id")), primary_key=True)
)

if environment == "production":
    board_pins.schema = SCHEMA
