from flask_wtf import FlaskForm
from wtforms import FileField
from flask_wtf.file import FileField, FileAllowed
from wtforms.validators import ValidationError
from app.models import User
from ..api.AWS_helpers import ALLOWED_EXTENSIONS

class UserImageForm(FlaskForm):

    url = FileField("Image Url", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])


