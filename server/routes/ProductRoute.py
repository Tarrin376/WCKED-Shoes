from flask import Blueprint, request, Response
from CustomExceptions.DBException import DBException
import json
from settings import limiter
from models.ProductModel import \
  create_product_handler,\
  get_products_handler,\
  get_product_handler,\
  update_product_handler,\
  delete_product_handler,\
  add_product_image_handler,\
  update_product_thumbnail_handler,\
  check_size_stock_handler,\
  recommend_customer_bought_handler,\
  frequently_bought_together_handler

products_blueprint = Blueprint("products", __name__)

@products_blueprint.route("", methods=["GET"])
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
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'page' and 'limit' query parameters must be numbers.", status=400, mimetype="text/plain")

@products_blueprint.route("/create", methods=["POST"])
def create_product():
  product = request.get_json()

  try:
    create_product_handler(product)
    return Response("Successfully created product.", status=201)
  except DBException as e:
    return Response(e.message, status=e.status_code)

@products_blueprint.route("/<product_id>", methods=["GET"])
@limiter.limit("1 per 5 seconds")
def get_product(product_id):
  try:
    product = get_product_handler(product_id)
    return Response(json.dumps(product.product_details()), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  
@products_blueprint.route("/<product_id>/<size>", methods=["GET"])
def check_size_stock(product_id, size):
  try:
    in_stock = check_size_stock_handler(product_id, size)
    return Response(json.dumps(in_stock), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>", methods=["PUT"])
def update_product(product_id):
  product = request.get_json()
  update_product_handler(product_id, product)

@products_blueprint.route("/<product_id>", methods=["DELETE"])
def delete_product(product_id):
  try:
    delete_product_handler(product_id)
    return Response("Successfully deleted product.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>/add-image", methods=["POST"])
def add_product_image(product_id):
  image_url = request.json.get("image_url")

  try:
    add_product_image_handler(product_id, image_url)
    return Response("Successfully added image to product.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")

@products_blueprint.route("/<product_id>/update-thumbnail", methods=["PUT"])
def update_product_thumbnail(product_id):
  try:
    thumbnail_url = request.json.get("thumbnail_url")
    update_product_thumbnail_handler(product_id, thumbnail_url)
    return Response("Successfully updated thumbnail.", status=200, mimetype="text/plain")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except Exception:
    return Response("Insufficient data supplied. Unable to perform requested action.", status=400, mimetype="text/plain")
  
@products_blueprint.route("/<product_id>/recommend-customer-bought", methods=["GET"])
def recommend_customer_bought(product_id):
  limit = request.args.get("limit", "20", str)

  try:
    recommended_products = recommend_customer_bought_handler((int)(product_id), (int)(limit))
    return Response(json.dumps(recommended_products), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'limit' query parameter or product id is not a number.", status=400, mimetype="text/plain")
  
@products_blueprint.route("/<product_id>/freq-bought-together", methods=["GET"])
def frequently_bought_together(product_id):
  limit = request.args.get("limit", "", str)

  if limit == "":
    return Response("Limit is not specified.", status=400, mimetype="text/plain")

  try:
    freq_bought_products = frequently_bought_together_handler((int)(product_id), (int)(limit))
    return Response(json.dumps(freq_bought_products), status=200, content_type="application/json")
  except DBException as e:
    return Response(e.message, status=e.status_code, mimetype="text/plain")
  except ValueError:
    return Response("'limit' query parameter or product id is not a number.", status=400, mimetype="text/plain")