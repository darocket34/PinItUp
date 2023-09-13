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
        pins = Pin.query.filter(Pin.boardId == board.id).all()
        pinList = [pin.to_dict() for pin in pins]
        if pinList:
            data["pins"] = pinList
        if previewPin:
            data["preview"] = previewPin.to_dict()
        allBoards.append(data)
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
        # name = request_data["name"],
        # description = request_data["description"],
        # creatorId = request_data["creatorId"]
    return {"errors": form.errors}, 400

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
