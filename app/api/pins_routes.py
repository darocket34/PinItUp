from flask import Blueprint, jsonify, request, redirect, url_for, abort
from app.models import Pin

pin_routes = Blueprint('pins', __name__)

def form_validation_errors(formErrors):
    """
    Helper to list error messages
    """
    errorList = []
    for field in formErrors:
        for error in formErrors[field]:
            errorList.append(f'{field} : {error}')
    return errorList

@pin_routes.route("/")
def all_pins():
    """
    Get all pins
    """
    allPins = [pin.to_dict() for pin in Pin.query.all()]
    return {"pins": allPins}
