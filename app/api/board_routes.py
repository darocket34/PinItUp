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
        return {"error": "User not found"}, 404
    allBoards = []
    for board in Board.query.filter(Board.creatorId == user.id).all():
        data = board.to_dict()
        previewPin = Pin.query.filter(Pin.boardId == board.id).first()
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
        return {"error", "Board not found"}, 404
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
    return {"errors": form.errors}, 400

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
    return {"errors": form.errors}, 400

@board_routes.route("/<int:id>/addpin", methods=["PUT"])
@login_required
def add_pin_to_board(id):
    req = request.get_json()
    print("BORARD--------", req)
    pinId = req["id"]
    pin = Pin.query.get(pinId)
    if not pin:
        return {"error", "Pin not found"}, 404
    board_id = req["id"]
    board = Board.query.get(board_id)
    board.pins.append(pin)
    db.session.commit()
    board = Board.query.get(board_id)
    print("POSTBOARD--------", board.pins)
    return board.to_dict()

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
        return {"error": "Board not found"}, 404
