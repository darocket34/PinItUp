from .db import db, environment, SCHEMA, add_prefix_for_prod

follows_table = db.Table(
  "follows",
  db.Model.metadata,
  db.Column("followerId", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
  db.Column("followingId", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True)
)

if environment == "production":
    follows_table.schema = SCHEMA
