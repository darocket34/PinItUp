from flask_wtf import FlaskForm
from wtforms import StringField, DateField, FileField
from flask_wtf.file import FileField, FileAllowed
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User
from ..api.AWS_helpers import ALLOWED_EXTENSIONS


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), Length(min=3, max=20)])
    username = StringField(
        'username', validators=[DataRequired(), username_exists, Length(min=3, max=20)])
    email = StringField('email', validators=[DataRequired(), user_exists, Length(min=5, max=40)])
    password = StringField('password', validators=[DataRequired(), Length(min=6, max=25)])
    birthday = DateField("birthday")
    profile_img = FileField("profile_image", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
