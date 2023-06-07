from flask import Blueprint, Response, g, request
from models.OrderModel import get_order_handler, get_orders_handler, update_order_status_handler
from CustomExceptions.DBException import DBException
from middleware.Authentication import authenticate_user
import json

orders_blueprint = Blueprint("orders", __name__)

@orders_blueprint.route("", methods=["GET"])
@authenticate_user
def get_orders():
  try:
    user_id = g.token["sub"]["id"]
    search = request.args.get("search", "", str)
    page = request.args.get("page", "1", str)
    limit = request.args.get("limit", "10", str)
    filter = request.args.get("filter", "", str)
    orders = get_orders_handler(user_id, search, (int)(page), (int)(limit), filter)
    return Response(json.dumps(orders), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'page' and 'limit' query parameters must be numbers", status=400, mimetype="text/plain")

@orders_blueprint.route("/<id>", methods=["GET"])
@authenticate_user
def get_order(id):
  try:
    user_id = g.token["sub"]["id"]
    order = get_order_handler(id, user_id)
    return Response(json.dumps(order), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@orders_blueprint.route("/<id>/update-status", methods=["PUT"])
def update_order_status(id):
  status = request.json.get("status")
  if status != "Order Created" and status != "Processing" and status != "Shipped" and status != "Delivered":
    return Response("Order status is not valid", status=400, mimetype="text/plain")
  
  try:
    update_order_status_handler(id, status)
    return Response(f"Order status was updated to: {status}", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
