from flask import request, Response, g
from functools import wraps
import jwt
import datetime
import os

def authenticate_user(func):
  @wraps(func)
  def get_auth_token(*args, **kwargs):
    try:
      auth_token = request.cookies.get("auth_token")
      if auth_token is None:
        resp = Response("Not logged in", status=401, mimetype="application/json")
        resp.set_cookie("auth_token", "", expires=0)
        return resp
      
      token = jwt.decode(auth_token, os.environ.get("JWT_SECRET_KEY"), algorithms=["HS256"])
      g.token = token
      return func(*args, **kwargs)
    except jwt.ExpiredSignatureError:
      return Response("Signature expired", status=403, mimetype="application/json")
    except jwt.InvalidTokenError:
      resp = Response("Your session token has been modified. Please refresh the page and log back in.", status=400, mimetype="application/json")
      resp.set_cookie("auth_token", "", expires=0)
      return resp

  return get_auth_token

def generate_auth_token(user_data):
  payload = {
    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
    "iat": datetime.datetime.utcnow(),
    "sub": user_data
  }

  auth_token = jwt.encode(payload, os.environ.get("JWT_SECRET_KEY"), algorithm="HS256")
  return auth_token