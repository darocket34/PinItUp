from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, follows_table, db

user_routes = Blueprint('users', __name__)


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

@user_routes.route('/follow/<int:creatorId>', methods=["PUT"])
@login_required
def followUser(creatorId):
    """
    Follow another user
    """
    req_data = request.get_json()
    print("DATA---------------------------------------", req_data)
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
    return {"error": "User not found"}, 404
