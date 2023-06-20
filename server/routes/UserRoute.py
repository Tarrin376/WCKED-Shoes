from flask import Blueprint, request, Response, g
from models.UserModel import \
  register_handler,\
  login_handler,\
  find_user_handler,\
  verify_email_handler,\
  send_code_handler,\
  add_to_cart_handler,\
  get_cart_handler,\
  update_item_quantity_handler,\
  checkout_handler,\
  cancel_order_handler,\
  buy_it_again_handler,\
  apply_discount_handler

import datetime
from random import randint
import json
from CustomExceptions.DBException import DBException
from middleware.Authentication import authenticate_user
from settings import limiter
from utils.Redis import cache, DEFAULT_EXPIRATION

user_blueprint = Blueprint("users", __name__)

REMEMBER_DURATION = 24
DONT_REMEMBER_DURATION = 3

@user_blueprint.route("/login", methods=["POST"])
@limiter.limit("2 per second")
def login():
  email = request.json.get("email")
  password = request.json.get("password")
  remember_me = request.json.get("remember_me")
  cookie_expires = REMEMBER_DURATION if remember_me else DONT_REMEMBER_DURATION

  try:
    result = login_handler(email, password)
    resp = Response(json.dumps(result[1]), status=200, mimetype="application/json")
    resp.set_cookie(key="auth_token", value=result[0], expires=datetime.datetime.utcnow() + datetime.timedelta(hours=cookie_expires), 
      httponly=True, samesite="None")
    return resp
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/jwt-login", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def jwt_login():
  token = g.token
  return Response(json.dumps(token["sub"]), status=200, mimetype="application/json")

@user_blueprint.route("/register", methods=["POST"])
@limiter.limit("2 per second")
def register():
  email = request.json.get("email")
  password = request.json.get("password")

  try:
    register_handler(email, password)
    return Response("Account created successfully.", status=201, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/logout", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def logout():
  try:
    resp = Response("Logged out successfully.", status=200, mimetype="application/json")
    resp.set_cookie("auth_token", "", expires=0, samesite="None")
    return resp
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/find", methods=["POST"])
@limiter.limit("2 per second")
def find_user():
  email = request.json.get("email")

  try:
    user_found = find_user_handler(email)
    return Response(user_found, status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/send-code", methods=["POST"])
@limiter.limit("3 per 60 seconds")
def send_code():
  email = request.json.get("email")
  code = "".join([str(randint(1, 9)) for _ in range(4)])

  try:
    send_code_handler(email, code)
    return Response(code, status=201, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/verify-email", methods=["POST"])
@limiter.limit("3 per 60 seconds")
def verify_email():
  code = request.json.get("code")
  email = request.json.get("email")

  try:
    verify_email_handler(email, code)
    return Response("Email verified.", status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")
  
@user_blueprint.route("/cart", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def get_cart():
  try:
    token = g.token
    cart = get_cart_handler(token["sub"]["id"])
    return Response(json.dumps(cart), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/cart/<product_id>", methods=["POST"])
@authenticate_user
@limiter.limit("3 per second")
def add_to_cart(product_id, size, quantity):
  try:
    size = request.json.get("size")
    quantity = request.json.get("quantity")

    if not size or not quantity:
      return Response("Size or quantity not specified", status=400, mimetype="application/json")

    token = g.token
    result = add_to_cart_handler(token["sub"]["id"], product_id, size, (int)(quantity))
    resp = Response(json.dumps(result), status=200, mimetype="application/json")
    return resp
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except ValueError:
    return Response("Invalid quantity.", status=400, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")
  
@user_blueprint.route("/cart/<product_id>/<size>/<quantity>", methods=["PUT", "DELETE"])
@authenticate_user
@limiter.limit("3 per second")
def update_item_quantity(product_id, size, quantity):
  try:
    token = g.token
    updated_cart = update_item_quantity_handler(token["sub"]["id"], product_id, size, (int)(quantity))
    resp = Response(json.dumps(updated_cart), status=200, mimetype="application/json")
    return resp
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except ValueError:
    return Response("Invalid quantity.", status=400, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")
  
@user_blueprint.route("/cart/checkout", methods=["POST"])
@authenticate_user
@limiter.limit("2 per second")
def checkout():
  try:
    order_details = request.get_json()
    token = g.token
    order_id = checkout_handler(token["sub"]["id"], order_details)
    resp = Response(json.dumps({"id": order_id}), status=201, mimetype="application/json")
    return resp
  except DBException as e:
    if e.data is not None: return Response(json.dumps(e.data), status=e.status_code, mimetype="application/json")
    else: return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")

@user_blueprint.route("/cancel-order/<order_id>", methods=["DELETE"])
@authenticate_user
@limiter.limit("2 per second")
def cancel_order(order_id):
  try:
    token = g.token
    cancel_order_handler(order_id, token["sub"]["id"])
    return Response(f"Order was successfully cancelled.", status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")
  
@user_blueprint.route("/buy-it-again", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def buy_it_again():
  limit = request.args.get("limit", "", str)

  if limit == "":
    return Response("Limit is not specified.", status=400, mimetype="application/json")

  try:
    token = g.token
    products = cache("/buy-it-again", buy_it_again_handler, DEFAULT_EXPIRATION, token["sub"]["id"], (int)(limit))
    return Response(json.dumps(products), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="application/json")
  except ValueError:
    return Response("'limit' is not a number.", status=400, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")
  
@user_blueprint.route("/apply-discount/<code_name>", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def apply_discount(code_name):
  try:
    token = g.token
    discount = apply_discount_handler(code_name, token["sub"]["id"])
    return Response(json.dumps(discount), status=200, mimetype="application/json")
  except DBException as e:
    return Response(e.message, e.status_code, mimetype="application/json")
  except Exception as e:
    return Response(str(e), status=500, mimetype="application/json")