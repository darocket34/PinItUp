from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import login_required, current_user
from app.models import Pin, Board, db, board_pins
from ..forms import PinForm
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
        print("IMGGGG------------------------------------------------", data)
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
        print("LAST NEO----------------------------------------------", pin.to_dict())
        return pin.to_dict()
    return {"errors": form.errors}, 400

@pin_routes.route("/<int:id>/edit", methods=["PUT"])
@login_required
def update_pin(id):
    current_date = datetime.now()
    request_data = request.get_json()
    print("DATRA------------------------------------------------", request_data)
    pin = Pin.query.get(id)
    # original_boardId = pin.boardId
    form = PinForm(
        name = request_data["name"],
        url = request_data["url"],
        description = request_data["description"],
        creatorId = request_data["creatorId"],
        # boardId = request_data["boardId"],
        postDate = current_date
    )
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    # board = Board.query.get(data["boardId"])
    if form.validate_on_submit():
        pin.name = data["name"]
        pin.description = data["description"]
        pin.url = data["url"]
        pin.creatorId = data["creatorId"]
        pin.postDate = current_date
        # pin.boardId = data["boardId"]
        # board.pins.append(pin)
        # db.session.execute(board_pins.delete().where(
        #     board_pins.c.pinId == id,
        #     board_pins.c.boardId == original_boardId
        # ))
        db.session.commit()
        return {"pin": pin.to_dict()}
    print("ERRORS--------------------------------------------", form.errors)
    return {"errors": form.errors}, 400

@pin_routes.route("/<int:id>")
def getSinglePin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {"error", "Pin not found"}, 404
    return {"pin": pin.to_dict()}

@pin_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def deletePin(id):
    pin = Pin.query.get(id)
    if pin:
        db.session.delete(pin)
        db.session.commit()
        return pin.to_dict()
    else:
        return {"error": "Pin not found"}, 404
