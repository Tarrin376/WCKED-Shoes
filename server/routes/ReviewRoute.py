from flask import Blueprint, request, Response, g
from models.ReviewModel import add_review_handler, get_reviews_handler, mark_helpful_handler, delete_review_handler
from CustomExceptions.DBException import DBException
from middleware.Authentication import authenticate_user
import json
from settings import limiter

reviews_blueprint = Blueprint("reviews", __name__)

@reviews_blueprint.route("/<product_id>", methods=["GET"])
@authenticate_user
@limiter.limit("2 per second")
def get_reviews(product_id):
  sort = request.args.get("sort", "helpful-count", str)
  filter = request.args.get("filter", "", str)
  page = request.args.get("page", "1", str)
  limit = request.args.get("limit", "4", str)
  asc = request.args.get("asc", "true", str)
  user_id = g.token["sub"]["id"]

  try:
    response = get_reviews_handler(product_id, sort, int(page), int(limit), asc, user_id, filter)
    return Response(json.dumps(response), status=200, content_type="application/json")
  except DBException as e:
    return Response(json.dumps({"error": e.message}), status=e.status_code, mimetype="application/json")
  except ValueError:
    return Response(json.dumps({"error": "'page' and 'limit' query parameters must be numbers."}), status=400, mimetype="application/json")
  except:
    return Response(json.dumps({"error": "An unexpected error occurred. Please report this issue if this continues."}), status=500, mimetype="application/json")
  
@reviews_blueprint.route("/<id>", methods=["DELETE"])
@authenticate_user
@limiter.limit("2 per second")
def delete_review(id):
  try:
    delete_review_handler(id)
    return Response(json.dumps({"success": "Review has been deleted."}), status=200, mimetype="application/json")
  except DBException as e:
    return Response(json.dumps({"error": e.message}), status=e.status_code, mimetype="application/json")
  except:
    return Response(json.dumps({"error": "An unexpected error occurred. Please report this issue if this continues."}), status=500, mimetype="application/json")
  
@reviews_blueprint.route("/<id>/helpful", methods=["PUT"])
@authenticate_user
@limiter.limit("2 per second")
def mark_helpful(id):
  try:
    user_id = g.token["sub"]["id"]
    helpful_count = mark_helpful_handler(id, user_id)
    return Response(json.dumps({"helpful_count": helpful_count}), status=201, mimetype="application/json")
  except DBException as e:
    return Response(json.dumps({"error": e.message}), status=e.status_code, mimetype="application/json")
  except KeyError:
    return Response(json.dumps({"error": "Insufficient data supplied. Unable to perform requested action."}), status=400, mimetype="application/json")
  except:
    return Response(json.dumps({"error": "An unexpected error occurred. Please report this issue if this continues."}), status=500, mimetype="application/json")

@reviews_blueprint.route("/<product_id>", methods=["POST"])
@authenticate_user
@limiter.limit("2 per second")
def add_review(product_id):
  data = request.get_json()
  token = g.token

  try:
    new_review = add_review_handler(product_id, token["sub"]["id"], data)
    return Response(json.dumps(new_review), status=201, mimetype="application/json")
  except DBException as e:
    return Response(json.dumps({"error": e.message}), status=e.status_code, mimetype="application/json")
  except:
    return Response(json.dumps({"error": "An unexpected error occurred. Please report this issue if this continues."}), status=500, mimetype="application/json")