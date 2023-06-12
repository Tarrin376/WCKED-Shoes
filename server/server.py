from routes.UserRoute import user_blueprint
from routes.ProductRoute import products_blueprint
from routes.ReviewRoute import reviews_blueprint
from routes.OrderRoute import orders_blueprint
from routes.DeliveryMethodRoute import delivery_method_blueprint
from routes.DiscountCodeRoute import discount_code_blueprint
from routes.AdminRoute import admin_blueprint
from flask import Blueprint

server_blueprint = Blueprint("server", __name__)
server_blueprint.register_blueprint(user_blueprint, url_prefix="/users")
server_blueprint.register_blueprint(products_blueprint, url_prefix="/products")
server_blueprint.register_blueprint(reviews_blueprint, url_prefix="/reviews")
server_blueprint.register_blueprint(orders_blueprint, url_prefix="/orders")
server_blueprint.register_blueprint(delivery_method_blueprint, url_prefix="/delivery-methods")
server_blueprint.register_blueprint(discount_code_blueprint, url_prefix="/discount-codes")
server_blueprint.register_blueprint(admin_blueprint, url_prefix="/admin")