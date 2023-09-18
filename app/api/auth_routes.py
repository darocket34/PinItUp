from flask import Blueprint, jsonify, session, request, json
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from .AWS_helpers import remove_file_from_s3, get_unique_filename, upload_file_to_s3


auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        followers = [follower.to_dict() for follower in current_user.followers]
        following = [follow.to_dict() for follow in current_user.following]
        userDict = current_user.to_dict()
        userDict['followers'] = followers
        userDict['following'] = following
        return userDict
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        followers = [follower.to_dict() for follower in user.followers]
        following = [follow.to_dict() for follow in user.following]
        userDict = user.to_dict()
        userDict['followers'] = followers
        userDict['following'] = following
        return userDict
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    raw_data_name = request.form.get("name")
    print("BE RAW DATA NAME----------------------------------------", json.loads(raw_data_name))
    raw_data_email = request.form.get("email")
    raw_data_username = request.form.get("username")
    raw_data_password = request.form.get("password")
    raw_data_birthday = request.form.get("birthday")

    raw_data_img = request.files.get("url")
    print("BE RAW DATA IMG----------------------------------------", raw_data_img)
    form = SignUpForm()
    data = form.data
    print("BE FORM DATA----------------------------------------", json.loads(raw_data_name))
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        image = raw_data_img
        image.filename = get_unique_filename(image.filename)
        print("BE IMG FILENAME----------------------------------------", image.filename)
        upload = upload_file_to_s3(image)
        # print("BE IMGURL----------------------------------------", upload)
        user = User(
            name= data['name'],
            username= data['username'],
            email= data['email'],
            password= data['password'],
            birthday= data['birthday'],
            profile_img= upload["url"]
        )
        print("BE USEROBJ----------------------------------------", user)
        db.session.add(user)
        db.session.commit()
        # print("BE USEROBJ----------------------------------------", user.to_dict())
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
