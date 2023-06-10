from flask import Blueprint, Response, g, request
from models.DiscountCodeModel import get_discount_handler, delete_discount_code_handler, create_discount_code_handler
from CustomExceptions.DBException import DBException 
import json
from middleware.Authentication import authenticate_user

discount_code_blueprint = Blueprint("discount_code", __name__)

@discount_code_blueprint.route("/<code_name>", methods=["GET"])
@authenticate_user
def apply_discount(code_name):
  try:
    token = g.token
    discount = get_discount_handler(code_name, token["sub"]["id"])
    return Response(json.dumps(discount), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")

@discount_code_blueprint.route("/<code_name>", methods=["DELETE"])
def delete_discount_code(code_name):
  try:
    delete_discount_code_handler(code_name)
    return Response(f"Succesfully deleted discount code: {code_name}.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")

@discount_code_blueprint.route("/create", methods=["POST"])
def create_discount_code():
  try:
    code_name = request.json.get("code_name")
    percent_off = request.json.get("percent_off")
    create_discount_code_handler(code_name, (float)(percent_off))
    return Response(f"Successfully created discount code: {code_name}.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("Discount percentage is invalid.", status=400, mimetype="text/plain")