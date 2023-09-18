from flask import Blueprint, jsonify, request, redirect, url_for, abort
from flask_login import login_required, current_user
from app.models import Board, User, Pin, db
from app.forms import BoardForm

board_routes = Blueprint('boards', __name__)

def form_validation_errors(formErrors):
    """
    Helper to list error messages
    """
    errorList = []
    for field in formErrors:
        for error in formErrors[field]:
            errorList.append(f'{field} : {error}')
    return errorList

@board_routes.route('/<string:username>/all')
def all_boards(username):
    """
    Get all boards
    """
    user = User.query.filter_by(username = username).first()
    if not user:
        return {"errors": "User not found"}, 404
    allBoards = []
    for board in Board.query.filter(Board.creatorId == user.id).all():
        data = board.to_dict()
        # last_pin = board.pins.order_by(Pin.id.desc()).first()
        # if last_pin:
        #     data['previewPin'] = last_pin.to_dict()
        # else:
        #     data['previewPin'] = None
        allBoards.append(data)
        db.session.commit()
    return {"boards": allBoards}

@board_routes.route('/<int:id>')
@login_required
def get_board(id):
    """
    Get single board
    """
    board = Board.query.get(id)
    if not board:
        return {"errors", "Board not found"}, 404
    return board.to_dict()

@board_routes.route('/new', methods=["POST"])
@login_required
def create_board():
    """
    Create Board
    """
    form = BoardForm()
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        board = Board(
            name = data["name"],
            description = data["description"],
            creatorId = data["creatorId"]
        )
        db.session.add(board)
        db.session.commit()
        return board.to_dict()
    return {'errors': form_validation_errors(form.errors)}, 401

@board_routes.route('/<int:id>/edit', methods=["PUT"])
@login_required
def update_board(id):
    """
    Update a single board
    """
    board = Board.query.get(id)
    request_data = request.get_json()
    form = BoardForm()
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        board.name = data["name"]
        board.description = data["description"]
        board.creatorId = data["creatorId"]
        db.session.commit()
        return board.to_dict()
    return {'errors': form_validation_errors(form.errors)}, 401

@board_routes.route("/<int:id>/addpin", methods=["PUT"])
@login_required
def add_pin_to_board(id):
    req = request.get_json()
    pinId = req["pin"]["id"]
    pin = Pin.query.get(pinId)
    if not pin:
        return {"errors", "Pin not found"}, 404
    board_id = req["board"]["id"]
    board = Board.query.get(board_id)
    board.pins.append(pin)
    db.session.commit()
    board = Board.query.get(board_id)
    return board.to_dict()

@board_routes.route("/<int:id>/removepin", methods=["DELETE"])
@login_required
def remove_pin_from_board(id):
    req = request.get_json()
    pinId = req["pin"]["id"]
    board_id = req["board"]["id"]
    pin = Pin.query.get(pinId)
    if not pin:
        return {"errors", "Pin not found"}, 404
    board = Board.query.get(board_id)
    if not board:
        return {"errors", "Board not found"}, 404
    if pin in board.pins:
        board.pins.remove(pin)
        db.session.commit()
        updatedBoard = Board.query.get(board.id)
    return updatedBoard.to_dict()

@board_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_board(id):
    """
    Delete board
    """
    board = Board.query.get(id)
    if board:
        db.session.delete(board)
        db.session.commit()
        return board.to_dict()
    else:
        return {"errors": "Board not found"}, 404
