from flask import Blueprint, request, Response
from CustomExceptions.DBException import DBException
from middleware.Authentication import authenticate_admin
import json
import requests
from settings import limiter
from utils.Redis import cache, DEFAULT_EXPIRATION
from models.ProductModel import \
  create_product_handler,\
  get_products_handler,\
  get_product_handler,\
  delete_product_handler,\
  add_product_image_handler,\
  update_product_thumbnail_handler,\
  check_size_stock_handler,\
  recommend_customer_bought_handler,\
  frequently_bought_together_handler

products_blueprint = Blueprint("products", __name__)

@products_blueprint.route("", methods=["GET"])
@limiter.limit("2 per second")
def get_products():
  sort = request.args.get("sort", "price", str)
  search = request.args.get("search", "", str)
  page = request.args.get("page", "1", str)
  limit = request.args.get("limit", "10", str)
  asc = request.args.get("asc", "true", str)

  try:
    response = get_products_handler(sort, search, int(page), int(limit), asc)
    return Response(json.dumps({
      "next": list(map(lambda x: x.card_details(), response["next"])),
      "meta": response["meta"]
    }), status=200, content_type="application/json")
  except requests.exceptions.ProxyError:
    raise DBException("Uh oh, our servers had trouble processing that request. Please try again.", 407)
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'page' and 'limit' must be numbers.", status=400, mimetype="text/plain")

@products_blueprint.route("/create", methods=["POST"])
@authenticate_admin
@limiter.limit("2 per second")
def create_product():
  product = request.get_json()

  try:
    create_product_handler(product)
    return Response("Successfully created product.", status=201)
  except DBException as e:
    return Response(e.message, status=e.status_code)

@products_blueprint.route("/<product_id>", methods=["GET"])
@limiter.limit("2 per second")
def get_product(product_id):
  try:
    product = cache(f"/products/{product_id}", get_product_handler, DEFAULT_EXPIRATION, product_id)
    return Response(json.dumps(product), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>/<size>", methods=["GET"])
@limiter.limit("2 per second")
def check_size_stock(product_id, size):
  try:
    in_stock = check_size_stock_handler(product_id, size)
    return Response(json.dumps(in_stock), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>", methods=["DELETE"])
@authenticate_admin
@limiter.limit("2 per second")
def delete_product(product_id):
  try:
    delete_product_handler(product_id)
    return Response("Successfully deleted product.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>/add-image", methods=["POST"])
@authenticate_admin
@limiter.limit("2 per second")
def add_product_image(product_id):
  image_url = request.json.get("image_url")

  try:
    add_product_image_handler(product_id, image_url)
    return Response("Successfully added image to product.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>/update-thumbnail", methods=["PUT"])
@authenticate_admin
@limiter.limit("2 per second")
def update_product_thumbnail(product_id):
  try:
    thumbnail_url = request.json.get("thumbnail_url")
    update_product_thumbnail_handler(product_id, thumbnail_url)
    return Response("Successfully updated thumbnail.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except Exception:
    return Response("Insufficient data supplied. Unable to perform requested action.", status=400, mimetype="text/plain")
  
@products_blueprint.route("/<product_id>/customers-bought", methods=["GET"])
@limiter.limit("2 per second")
def recommend_customer_bought(product_id):
  limit = request.args.get("limit", "20", str)

  try:
    recommended_products = cache(f"/{product_id}/customers-bought", recommend_customer_bought_handler, 
      DEFAULT_EXPIRATION, (int)(product_id), (int)(limit))
    return Response(json.dumps(recommended_products), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'limit' or 'product id' is not a number.", status=400, mimetype="text/plain")
  
@products_blueprint.route("/<product_id>/freq-bought", methods=["GET"])
@limiter.limit("2 per second")
def frequently_bought_together(product_id):
  limit = request.args.get("limit", "", str)

  if limit == "":
    return Response("Limit is not specified.", status=400, mimetype="text/plain")

  try:
    freq_bought_products = cache(f"/{product_id}/freq-bought", frequently_bought_together_handler,
      DEFAULT_EXPIRATION, (int)(product_id), (int)(limit))
    return Response(json.dumps(freq_bought_products), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'limit' or 'product id' is not a number.", status=400, mimetype="text/plain")