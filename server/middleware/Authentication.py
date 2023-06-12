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
        resp = Response("You are not logged in.", status=401, mimetype="application/json")
        resp.set_cookie("auth_token", "", expires=0)
        return resp
      
      token = jwt.decode(auth_token, os.environ.get("USER_JWT_SECRET_KEY"), algorithms=["HS256"])
      g.token = token
      return func(*args, **kwargs)
    except jwt.ExpiredSignatureError:
      return Response("Session expired. Please log back in.", status=403, mimetype="application/json")
    except jwt.InvalidTokenError:
      resp = Response("Authorization denied.", status=401, mimetype="application/json")
      resp.set_cookie("auth_token", "", expires=0) # Set samesite attribute to True when app is using https.
      return resp

  return get_auth_token

def authenticate_admin(func):
  @wraps(func)
  def get_auth_token(*args, **kwargs):
    try:
      auth_token = request.cookies.get("auth_token")
      if auth_token is None:
        resp = Response("You are not logged in.", status=401, mimetype="application/json")
        resp.set_cookie("auth_token", "", expires=0)
        return resp
      
      token = jwt.decode(auth_token, os.environ.get("ADMIN_JWT_SECRET_KEY"), algorithms=["HS256"])
      g.token = token
      return func(*args, **kwargs)
    except jwt.ExpiredSignatureError:
      return Response("Session expired. Please log back in.", status=403, mimetype="application/json")
    except jwt.InvalidTokenError:
      resp = Response("Authorization denied.", status=401, mimetype="application/json")
      resp.set_cookie("auth_token", "", expires=0) # Set samesite attribute to True when app is using https.
      return resp
  
  return get_auth_token
    
def generate_auth_token(user_data, secret_key):
  payload = {
    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
    "iat": datetime.datetime.utcnow(),
    "sub": user_data
  }

  auth_token = jwt.encode(payload, os.environ.get(secret_key), algorithm="HS256")
  return auth_token