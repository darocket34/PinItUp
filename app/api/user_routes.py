from flask import Blueprint, jsonify, request, json
from flask_login import login_required
from app.models import User, follows_table, db
from app.forms import UpdateUserTextForm, UserImageForm
from .AWS_helpers import remove_file_from_s3, get_unique_filename, upload_file_to_s3

user_routes = Blueprint('users', __name__)

def form_validation_errors(validation_errors):
    """
    Helper to list error messages
    """
    errorList = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorList.append({f'{field}' : f'{error}'})
    return errorList

@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/username/<string:username>')
@login_required
def userByUsername(username):
    """
    Query for a user by username and returns that user in a dictionary
    """
    user = User.query.filter(User.username == username).first()
    if user:
        followers = [follower.to_dict() for follower in user.followers]
        following = [follow.to_dict() for follow in user.following]
        userDict = user.to_dict()
        userDict['followers'] = followers
        userDict['following'] = following
        return userDict
    return {"errors": "User not found"}, 404

@user_routes.route('/<int:id>')
@login_required
def userById(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if user:
        followers = [follower.to_dict() for follower in user.followers]
        following = [follow.to_dict() for follow in user.following]
        userDict = user.to_dict()
        userDict['followers'] = followers
        userDict['following'] = following
        return userDict
    return {"errors": "User not found"}, 404

@user_routes.route('/set/<int:id>')
@login_required
def resetCurrUser(id):
    """
    Query to set the current user with updated information
    """
    user = User.query.get(id)
    if user:
        followers = [follower.to_dict() for follower in user.followers]
        following = [follow.to_dict() for follow in user.following]
        userDict = user.to_dict()
        userDict['followers'] = followers
        userDict['following'] = following
        return userDict
    return {"errors": "User not found"}, 404

@user_routes.route('/follow/<int:creatorId>', methods=["PUT"])
@login_required
def followUser(creatorId):
    """
    Follow another user
    """
    req_data = request.get_json()
    followedId = req_data["creator"]
    userId = req_data["user"]
    followed = User.query.get(followedId)
    user = User.query.get(userId)
    if followed and user:
        if followed in user.following.all():
            return {"error": "Already following user"}, 400
        user.following.append(followed)
        db.session.commit()
        return user.to_dict()
    return {"errors": "User not found"}, 404

@user_routes.route('/unfollow/<int:creatorId>', methods=["PUT"])
@login_required
def unfollowUser(creatorId):
    """
    Unfollow another user
    """
    req_data = request.get_json()
    userId = req_data["user"]
    followedId = req_data["creator"]
    followed = User.query.get(followedId)
    user = User.query.get(userId)
    if followed and user:
        if followed in user.following.all():
            user.following.remove(followed)
            db.session.commit()
            return user.to_dict()
        return {"error": "Not currently following user"}, 400
    return {"errors": "User not found"}, 404

@user_routes.route('/<string:username>/edit', methods=['PUT'])
@login_required
def updateUser(username):
    """
    Update user profile
    """
    raw_data = request.form.get("text")
    if raw_data:
        req_data = json.loads(raw_data)
    req_img_data = request.files.get("url")
    user = User.query.filter(User.username == username).first()
    if not user:
        return {'errors': "User not found"},404
    if raw_data and req_data and req_data["username"]:
        if not req_data["username"] == user.username:
            form = UpdateUserTextForm(
                username = req_data["username"]
            )
            data = form.data
            form['csrf_token'].data = request.cookies['csrf_token']
            if form.validate_on_submit():
                user.name = req_data["name"]
                user.username = data["username"]
                db.session.commit()
                return user.to_dict()
        else:
            user.name = req_data["name"]
            db.session.commit()
            return user.to_dict()
        return {'errors': form_validation_errors(form.errors)}, 400
    if req_img_data:
        form = UserImageForm()
        data = form.data
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            image = req_img_data
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            if not upload["url"]:
                return {"errors": {"img": upload}}
            user.profile_img = upload["url"]
            db.session.commit()
            return user.to_dict()
        return {'errors': form_validation_errors(form.errors)}, 400
    return {'errors': "Something went wrong."}
