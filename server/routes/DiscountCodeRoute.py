from flask import Blueprint, Response, request
from models.DiscountCodeModel import delete_discount_code_handler, create_discount_code_handler
from CustomExceptions.DBException import DBException 
from middleware.Authentication import authenticate_admin
from utils.Redis import rate_limit
import uuid

discount_code_blueprint = Blueprint("discount_code", __name__)

@discount_code_blueprint.route("/<code_name>", methods=["DELETE"])
@authenticate_admin
@rate_limit(1, 5, uuid.uuid4())
def delete_discount_code(code_name):
  try:
    delete_discount_code_handler(code_name)
    return Response(f"Succesfully deleted discount code: {code_name}.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")

@discount_code_blueprint.route("/create", methods=["POST"])
@authenticate_admin
@rate_limit(1, 5, uuid.uuid4())
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