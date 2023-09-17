from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateTimeField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Comment

class CommentForm(FlaskForm):

    creatorId = IntegerField("Creator Id", validators=[DataRequired()])
    pinId = IntegerField("Pin Id", validators=[DataRequired()])
    comment = StringField("Comment", validators=[DataRequired(), Length(min=1, max=250)])
    date = DateTimeField("Date", validators=[DataRequired()])

def to_dict(self):
    return {
        "creatorId": self.creatorId,
        "pinId": self.pinId,
        "comment": self.comment,
        "date": self.date
    }
