from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from app.models import Board
from wtforms.validators import DataRequired, Length

class BoardForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(min=0, max=60)])
    description = StringField("Description", validators=[DataRequired(), Length(min=0, max=300)])
    creatorId = IntegerField("Creator Id", validators=[DataRequired()])

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "creatorId": self.creatorId
        }
