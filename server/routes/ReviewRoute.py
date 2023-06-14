from flask import Blueprint, request, Response, g
from models.ReviewModel import add_review_handler, get_reviews_handler, add_helpful_count_handler, delete_review_handler
from CustomExceptions.DBException import DBException
from middleware.Authentication import authenticate_user
import json
from utils.Redis import rate_limit
import uuid

reviews_blueprint = Blueprint("reviews", __name__)

@reviews_blueprint.route("/<product_id>", methods=["GET"])
@authenticate_user
@rate_limit(1, 1, uuid.uuid4())
def get_reviews(product_id):
  sort = request.args.get("sort", "date-posted", str)
  search = request.args.get("search", "", str)
  page = request.args.get("page", "1", str)
  limit = request.args.get("limit", "4", str)
  asc = request.args.get("asc", "true", str)
  user_id = g.token["sub"]["id"]

  try:
    response = get_reviews_handler(product_id, sort, search, int(page), int(limit), asc, user_id)
    return Response(json.dumps(response), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'page' and 'limit' query parameters must be numbers.", status=400, mimetype="text/plain")
  
@reviews_blueprint.route("/<id>", methods=["DELETE"])
@authenticate_user
@rate_limit(1, 5, uuid.uuid4())
def delete_review(id):
  try:
    delete_review_handler(id)
    return Response("Review deleted.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@reviews_blueprint.route("/<id>/helpful", methods=["PUT"])
@authenticate_user
@rate_limit(1, 1, uuid.uuid4())
def add_helpful_count(id):
  try:
    user_id = g.token["sub"]["id"]
    helpful_count = add_helpful_count_handler(id, user_id)
    return Response(str(helpful_count), status=201, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except KeyError:
    return Response("Insufficient data supplied. Unable to perform requested action.", status=400, mimetype="text/plain")

@reviews_blueprint.route("/<product_id>", methods=["POST"])
@authenticate_user
@rate_limit(1, 5, uuid.uuid4())
def add_review(product_id):
  data = request.get_json()
  token = g.token

  try:
    new_review = add_review_handler(product_id, token["sub"]["id"], data)
    return Response(json.dumps(new_review), status=201, mimetype="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")