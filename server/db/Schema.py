import settings
from datetime import datetime
from dataclasses import dataclass
import functools

@dataclass
class User(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  email = settings.db.Column(settings.db.String(120), unique=True, nullable=False)
  hash = settings.db.Column(settings.db.TEXT, nullable=False)
  reviews = settings.db.relationship('Review', backref='user', lazy=True, cascade="all, delete")
  orders = settings.db.relationship('Order', backref='user', lazy=True)
  cart = settings.db.relationship('CartItem', backref='user', lazy=True, cascade="all, delete")
  discounts = settings.db.relationship('DiscountJunction', backref='user', lazy=True, cascade="all, delete")
  purchased_products = settings.db.relationship('Product', secondary='purchased_products', lazy='subquery', backref=settings.db.backref('users', lazy=True))

  def as_dict(self):
    return {
      "id": self.id,
      "email": self.email,
    }
  
class Admin(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  email = settings.db.Column(settings.db.String(120), unique=True, nullable=False)
  hash = settings.db.Column(settings.db.TEXT, nullable=False)

  def as_dict(self):
    return {
      "id": self.id,
      "email": self.email,
    } 
  
class HelpfulReview(settings.db.Model):
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False, primary_key=True)
  review_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('review.id'), nullable=False, primary_key=True)

class CartItem(settings.db.Model):
  item_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('size.id'), nullable=False, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False, primary_key=True)
  quantity = settings.db.Column(settings.db.Integer, nullable=False)

  def as_dict(self):
    return {
      "item_id": self.item_id,
      "quantity": self.quantity
    }

class Size(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  product_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False)
  stock = settings.db.Column(settings.db.Integer, default=0, nullable=False)
  size = settings.db.Column(settings.db.String(20), nullable=False)

  def as_dict(self):
    return {
      "size": self.size,
      "id": self.id,
      "stock": self.stock,
    }

class Product(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  name = settings.db.Column(settings.db.String(100), nullable=False)
  reviews = settings.db.relationship('Review', backref='product', lazy=True, cascade="all, delete")
  num_reviews = settings.db.Column(settings.db.Integer, default=0)
  num_sold = settings.db.Column(settings.db.Integer, default=0)
  ratings = settings.db.Column(settings.db.Integer, default=0)
  rating = settings.db.Column(settings.db.Float, default=0)
  description = settings.db.Column(settings.db.String(500), nullable=False)
  price = settings.db.Column(settings.db.Float, nullable=False)
  images = settings.db.relationship('ProductImage', backref='product', lazy=True, cascade="all, delete")
  thumbnail = settings.db.Column(settings.db.TEXT, nullable=False)
  carbon_footprint = settings.db.Column(settings.db.Float, nullable=False)
  sizes = settings.db.relationship('Size', backref='product', lazy=True, cascade="all, delete")

  @staticmethod
  def sort_by_params():
    return {
      "popularity": Product.num_sold,
      "rating": Product.rating,
      "price": Product.price,
      "carbon-footprint": Product.carbon_footprint,
    }
  
  def product_details(self):
    return {
      "id": self.id,
      "name": self.name,
      "num_reviews": self.num_reviews,
      "num_sold": self.num_sold,
      "description": self.description,
      "price": self.price,
      "images": list(map(lambda image: image.image_url, self.images)),
      "carbon_footprint": self.carbon_footprint,
      "thumbnail": self.thumbnail,
      "rating": self.rating,
      "sizes": list(map(lambda size: size.as_dict(), self.sizes)),
    }
  
  def card_details(self):
    return {
      "id": self.id,
      "name": self.name,
      "rating": self.rating,
      "price": self.price,
      "carbon_footprint": self.carbon_footprint,
      "num_sold": self.num_sold,
      "thumbnail": self.thumbnail,
      "stock": functools.reduce(lambda x, y: x + y, list(map(lambda size: size.stock, self.sizes)), 0),
      "sizes": list(map(lambda size: size.as_dict(), self.sizes)),
    }

class ProductImage(settings.db.Model):
  __tablename__ = 'product_image'
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  product_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False)
  image_url = settings.db.Column(settings.db.TEXT, nullable=False)

class Review(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, unique=True, nullable=False, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False)
  product_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False)
  rating = settings.db.Column(settings.db.Integer, nullable=False)
  title = settings.db.Column(settings.db.String(50), nullable=False)
  review = settings.db.Column(settings.db.String(200), nullable=False)
  date_posted = settings.db.Column(settings.db.DateTime(timezone=True), default=datetime.now, nullable=False)
  helpful_count = settings.db.Column(settings.db.Integer, default=0)
  verified_purchase = settings.db.Column(settings.db.Boolean, default=False)

  def as_dict(self, is_marked, is_own_review):
    return {
      "id": self.id,
      "user_id": self.user_id,
      "product_id": self.product_id,
      "rating": self.rating,
      "title": self.title,
      "review": self.review,
      "date_posted": f"{self.date_posted}",
      "helpful_count": self.helpful_count,
      "is_marked": is_marked,
      "verified_purchase": self.verified_purchase,
      "is_own_review": is_own_review
    }
  
  @staticmethod
  def sort_by_params():
    return {
      "date-posted": Review.date_posted,
      "helpful-count": Review.helpful_count
    }
  
class Order(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False)
  date_ordered = settings.db.Column(settings.db.DateTime, nullable=False)
  processing_date = settings.db.Column(settings.db.DateTime)
  shipped_date = settings.db.Column(settings.db.DateTime)
  delivered_date = settings.db.Column(settings.db.DateTime)
  order_status = settings.db.Column(settings.db.String(100), nullable=False)
  total_cost = settings.db.Column(settings.db.Float, nullable=False)
  address_line1 = settings.db.Column(settings.db.String(100), nullable=False)
  address_line2 = settings.db.Column(settings.db.String(100), nullable=True)
  town_or_city = settings.db.Column(settings.db.String(100), nullable=False)
  postcode = settings.db.Column(settings.db.String(10), nullable=False)
  mobile_number = settings.db.Column(settings.db.String(20), nullable=False)
  card_end = settings.db.Column(settings.db.String(4), nullable=False)
  country = settings.db.Column(settings.db.String(100), nullable=False)
  delivery_method = settings.db.Column(settings.db.String(100), settings.db.ForeignKey('delivery_method.name'), nullable=False)
  discount = settings.db.Column(settings.db.String(50), settings.db.ForeignKey('discount_code.name'))
  cancelled = settings.db.Column(settings.db.Boolean, default=False)
  delivery_instructions = settings.db.Column(settings.db.String(100), nullable=False)

  def as_dict(self):
    return {
      "id": self.id,
      "date_ordered": f"{self.date_ordered}",
      "processing_date": f"{self.processing_date}",
      "shipped_date": f"{self.shipped_date}",
      "delivered_date": f"{self.delivered_date}",
      "order_status": self.order_status,
      "total_cost": self.total_cost,
      "address_line1": self.address_line1,
      "address_line2": self.address_line2,
      "town_or_city": self.town_or_city,
      "postcode": self.postcode,
      "mobile_number": self.mobile_number,
      "card_end": self.card_end,
      "country": self.country,
      "delivery_method": DeliveryMethod.query.filter_by(name=self.delivery_method).first().as_dict(),
      "cancelled": self.cancelled,
      "delivery_instructions": self.delivery_instructions,
      "discount": DiscountCode.query.filter_by(name=self.discount).first().as_dict() if self.discount else {
        "name": "N/A",
        "percent_off": 0
      }
    }

class OrderItem(settings.db.Model):
  __tablename__ = 'order_item'
  item_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('size.id'), nullable=False, primary_key=True)
  order_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('order.id'), nullable=False, primary_key=True)
  quantity = settings.db.Column(settings.db.Integer, nullable=False)

class VerificationCode(settings.db.Model):
  __tablename__ ='verification_code'
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'))
  email = settings.db.Column(settings.db.String(120), unique=True, nullable=False)
  code = settings.db.Column(settings.db.String(4), nullable=False)
  date_created = settings.db.Column(settings.db.DateTime(timezone=True), default=datetime.now, nullable=False)

class DeliveryMethod(settings.db.Model):
  __tablename__ = 'delivery_method'
  name = settings.db.Column(settings.db.String(100), nullable=False, primary_key=True)
  estimated_lower_days = settings.db.Column(settings.db.Integer, nullable=False)
  estimated_higher_days = settings.db.Column(settings.db.Integer, nullable=False)
  price = settings.db.Column(settings.db.Float, nullable=False)

  def as_dict(self):
    return {
      "name": self.name,
      "estimated_lower_days": self.estimated_lower_days,
      "estimated_higher_days": self.estimated_higher_days,
      "price": self.price
    }
  
class DiscountJunction(settings.db.Model):
  id = settings.db.Column(settings.db.Integer, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False)
  discount_name = settings.db.Column(settings.db.String(50), settings.db.ForeignKey('discount_code.name'), nullable=False)
  
class DiscountCode(settings.db.Model):
  __tablename__ = 'discount_code'
  name = settings.db.Column(settings.db.String(50), nullable=False, primary_key=True)
  percent_off = settings.db.Column(settings.db.Float, nullable=False)
  users = settings.db.relationship('DiscountJunction', backref='discount_code', lazy=True, cascade="all, delete")

  def as_dict(self):
    return {
      "name": self.name,
      "percent_off": self.percent_off
    }

purchased_product = settings.db.Table('purchased_products',
  settings.db.Column('user_id', settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False, primary_key=True),
  settings.db.Column('product_id', settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False, primary_key=True)
)

class ProductBoughtVector(settings.db.Model):
  product_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False, primary_key=True)
  user_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('user.id'), nullable=False, primary_key=True)
  bought = settings.db.Column(settings.db.Integer, default=0)
  times_bought = settings.db.Column(settings.db.Integer, default=0)

class BoughtTogether(settings.db.Model):
  product_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False, primary_key=True)
  bought_with_id = settings.db.Column(settings.db.Integer, settings.db.ForeignKey('product.id'), nullable=False, primary_key=True)
  product = settings.db.relationship("Product", foreign_keys=[product_id], uselist=False)
  bought_with = settings.db.relationship("Product", foreign_keys=[bought_with_id], uselist=False)
  frequency = settings.db.Column(settings.db.Integer, default=1)