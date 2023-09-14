from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, SubmitField, IntegerField, FileField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Pin
from ..api.AWS_helpers import ALLOWED_EXTENSIONS

class PinForm(FlaskForm):

    name = StringField("Name", validators=[DataRequired(), Length(min=0, max=60)])
    description = StringField("Description", validators=[DataRequired(), Length(min=0, max=300)])
    url = FileField("Image Url", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    creatorId = IntegerField("Creator Id", validators=[DataRequired()])
    postDate = StringField("Day", validators=[DataRequired()])
    boardId = IntegerField("Board Id")

def to_dict(self):
    return {
    'name': self.name,
    'description': self.description,
    'url': self.url,
    'creatorId': self.creatorId,
    'postDate': self.postDate,
    'boardId': self.boardId
    }
