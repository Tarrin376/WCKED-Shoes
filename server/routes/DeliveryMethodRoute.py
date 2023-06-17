from flask import Blueprint, Response, request
from models.DeliveryMethodModel import add_delivery_method_handler, delete_delivery_method_handler, get_delivery_methods_handler
from CustomExceptions.DBException import DBException 
from middleware.Authentication import authenticate_admin
import json
from settings import limiter

delivery_method_blueprint = Blueprint("delivery_method", __name__)

@delivery_method_blueprint.route("/add-delivery-method", methods=["POST"])
@authenticate_admin
@limiter.limit("2 per second")
def add_delivery_method():
  method_json = request.get_json()
  try:
    add_delivery_method_handler(method_json)
    return Response("New delivery method added successfully.", status=201, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except Exception as e:
    return Response(str(e), status=500, mimetype="text/plain")

@delivery_method_blueprint.route("/delete-delivery-method/<name>", methods=["DELETE"])
@authenticate_admin
@limiter.limit("2 per second")
def delete_delivery_method(name):
  try:
    delete_delivery_method_handler(name)
    return Response("Delivery method has been deleted successfully.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")
  except Exception as e:
    return Response(str(e), status=500, mimetype="text/plain")

@delivery_method_blueprint.route("", methods=["GET"])
@limiter.limit("2 per second")
def get_delivery_methods():
  try:
    delivery_methods = get_delivery_methods_handler()
    return Response(json.dumps(delivery_methods), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="text/plain")
  except Exception as e:
    return Response(str(e), status=500, mimetype="text/plain")