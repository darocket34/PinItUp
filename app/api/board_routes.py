from flask import Blueprint, jsonify, request, redirect, url_for, abort
from app.models import Board, User, Pin

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

@board_routes.route('/<string:username>')
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


# .filter_by(creatorId=userId)
# allBoards = [board.to_dict() for board in Board.query.filter(Board.creatorId == user.id).all()]
