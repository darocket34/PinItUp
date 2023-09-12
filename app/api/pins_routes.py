from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import login_required, current_user
from app.models import Pin, Board, db
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
    current_date = datetime.now()
    form = PinForm()
    data = form.data
    boardId = data["boardId"]
    board = Board.query.get(boardId)
    form['csrf_token'].data = request.cookies['csrf_token']
    print("PIN_____________________", form)
    if form.validate_on_submit():
        image = data["url"]
        print("IMAGE", image)
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        if "url" not in upload:
            return {"errors": upload}
        pin = Pin(
            name = data["name"],
            description = data["description"],
            url = upload["url"],
            creatorId = current_user.id,
            postDate = current_date,
            boardId = data["boardId"]
        )
        board.pins.append(pin)
        db.session.add(pin)
        db.session.commit()
        return pin.to_dict()
    return {"errors": form.errors}, 400

@pin_routes.route("/<int:id>")
@login_required
def getSinglePin(id):
    pin = Pin.query.get(id)
    if not pin:
        return {"error", "Pin not found"}, 404
    print("PRINT_______________", pin.to_dict())
    return {"pin": pin.to_dict()}
