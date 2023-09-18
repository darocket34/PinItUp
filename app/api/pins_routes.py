from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import login_required, current_user
from app.models import Pin, Board, db, board_pins, Comment, User
from ..forms import PinForm, CommentForm
from .AWS_helpers import remove_file_from_s3, get_unique_filename, upload_file_to_s3
from datetime import datetime

pin_routes = Blueprint('pins', __name__)

def form_validation_errors(validation_errors):
    """
    Helper to list error messages
    """
    errorList = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorList.append(f'{field} : {error}')
    return errorList

@pin_routes.route("/")
def all_pins():
    """
    Get all pins
    """
    allPins = [pin.to_dict() for pin in Pin.query.all()]
    return {"pins": allPins}

@pin_routes.route("/<string:username>/all")
@login_required
def all_pins_by_username(username):
    """
    Query all pins by username for the profile page
    """
    user = User.query.filter(User.username == username).first()
    userPins = Pin.query.filter(Pin.creatorId == user.id).all()
    allPins = [pin.to_dict() for pin in userPins]
    return {"pins": allPins}

@pin_routes.route("/newpin", methods=["POST"])
@login_required
def create_pin():
    """
    Create a new pin
    """
    req_data = request.files.get("url")
    form = PinForm()
    data = form.data
    boardId = data["boardId"]
    board = Board.query.get(boardId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        image = req_data
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        if not upload["url"]:
            return {"errors": {"img": upload}}
        pin = Pin(
            name = data["name"],
            description = data["description"],
            url = upload["url"],
            creatorId = current_user.id,
            postDate = data["postDate"],
            boardId = data["boardId"]
        )
        board.pins.append(pin)
        db.session.add(pin)
        db.session.commit()
        return pin.to_dict()
    return {'errors': form_validation_errors(form.errors)}, 401

@pin_routes.route("/<int:id>/edit", methods=["PUT"])
@login_required
def update_pin(id):
    current_date = datetime.now()
    request_data = request.get_json()
    pin = Pin.query.get(id)
    form = PinForm(
        name = request_data["name"],
        url = request_data["url"],
        description = request_data["description"],
        creatorId = request_data["creatorId"],
        postDate = current_date
    )
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        pin.name = data["name"]
        pin.description = data["description"]
        pin.url = data["url"]
        pin.creatorId = data["creatorId"]
        pin.postDate = current_date
        db.session.commit()
        return {"pin": pin.to_dict()}
    return {'errors': form_validation_errors(form.errors)}, 401

@pin_routes.route("/<int:id>")
def getSinglePin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {"error", "Pin not found"}, 404
    return {"pin": pin.to_dict()}

@pin_routes.route("/<int:id>/comment", methods=["POST"])
@login_required
def addComment(id):
    pin = Pin.query.get(id)
    if not pin:
        return {"error", "Pin not found"}, 404
    req_data = request.get_json()
    form = CommentForm(
        creatorId = req_data['creatorId'],
        pinId = req_data['pinId'],
        comment = req_data['comment'],
        date= datetime.now()
    )
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        newComment = Comment(
            creatorId = data["creatorId"],
            pinId = data["pinId"],
            comment = data["comment"],
            date = data["date"]
        )
        db.session.add(newComment)
        db.session.commit()
        return newComment.to_dict()
    return {'errors': form_validation_errors(form.errors)}, 401

@pin_routes.route("/<int:id>/comment", methods=["DELETE"])
@login_required
def deleteComment(id):
    req_data = request.get_json()
    commentId = req_data["comment"]["id"]
    pinId = req_data["pin"]["id"]
    comment = Comment.query.get(commentId)
    if comment:
        db.session.delete(comment)
        pin = Pin.query.get(pinId)
        if not pin:
            return {"error", "Pin not found"}, 404
        if comment in pin.comments:
            pin.comments.remove(comment)
        db.session.commit()
        updatedPin = pin.to_dict()
        return jsonify(updatedPin["comments"])
    return {"errors": "Delete unsuccessful"}, 400

@pin_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def deletePin(id):
    pin = Pin.query.get(id)
    if pin:
        db.session.delete(pin)
        db.session.commit()
        return pin.to_dict()
    else:
        return {"errors": "Pin not found"}, 404
