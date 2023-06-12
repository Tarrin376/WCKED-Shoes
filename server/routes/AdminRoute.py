from CustomExceptions.DBException import DBException
from flask import Blueprint, request, Response
from models.AdminModel import login_handler, create_admin_handler
import json
import datetime

admin_blueprint = Blueprint("admin", __name__)

@admin_blueprint.route('/login', methods=["POST"])
def login():
  email = request.json.get("email")
  password = request.json.get("password")

  try:
    result = login_handler(email, password)
    resp = Response(json.dumps(result[1]), status=200, mimetype="application/json")
    resp.set_cookie(key="auth_token", value=result[0], expires=datetime.datetime.utcnow() + datetime.timedelta(hours=2), httponly=True)
    return resp
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  
@admin_blueprint.route('/create', methods=["POST"])
def create_admin():
  email = request.json.get("email")
  password = request.json.get("password")

  try:
    create_admin_handler(email, password)
    return Response("Admin account created successfully.", status=201, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")