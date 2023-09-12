from .db import db, environment, SCHEMA, add_prefix_for_prod

board_pins = db.Table(
  "board_pins",
  db.Model.metadata,
#   db.Column("id", db.Integer, primary_key=True),
  db.Column("boardId", db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")), primary_key=True),
  db.Column("pinId", db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")), primary_key=True)
)

if environment == "production":
    board_pins.schema = SCHEMA

# class BoardPin(db.Model):
#     __tablename__ = "board_pins"

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     boardId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")))
#     pinId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")))
