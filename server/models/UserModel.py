from utils.HashPassword import hash_password
import settings
from db.Schema import User,\
  Product,\
  Size,\
  CartItem,\
  Order,\
  OrderItem,\
  DiscountCode,\
  DiscountJunction,\
  ProductBoughtVector,\
  BoughtTogether,\
  DeliveryMethod

from sqlalchemy import exc
from middleware.Authentication import generate_auth_token
from db.Schema import VerificationCode
from datetime import datetime
from CustomExceptions.DBException import DBException
from flask_bcrypt import Bcrypt

MAX_ITEM_QUANTITY = 10
bcrypt = Bcrypt()

def login_handler(email, password):
  try:
    user: User = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.hash, password):
      raise DBException("Invalid email or password", 401)
    
    user_data = user.as_dict()
    auth_token = generate_auth_token(user_data, "USER_JWT_SECRET_KEY")
    return (auth_token, user_data)
  except exc.SQLAlchemyError:
    raise DBException("Failed to check login credentials. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def register_handler(email, password):
  try:
    hash = hash_password(password)
    new_user = User(email=email, hash=hash)
    settings.db.session.add(new_user)
    settings.db.session.commit()

    products = settings.db.session.query(Product).all()
    for product in products:
      unit_v: ProductBoughtVector = ProductBoughtVector(product_id=product.id, user_id=new_user.id)
      settings.db.session.add(unit_v)
      settings.db.session.commit()
  except exc.SQLAlchemyError as e:
    raise DBException("Failed to create user account. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def find_user_handler(email):
  try:
    user: User = User.query.filter_by(email=email).first()

    if user is None: 
      raise DBException("User not found", 404)
    
    return "User found"
  except exc.SQLAlchemyError:
    raise DBException("There was a problem signing you up. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def send_code_handler(email, code):
  try:
    send_email(email, code)
    verification_code: VerificationCode = VerificationCode.query.filter_by(email=email).first()

    if verification_code is None:
      newCode = VerificationCode(email=email, code=code, date_created=datetime.now())
      settings.db.session.add(newCode)
    else:
      verification_code.code = code

    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to create verification code. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def send_email(email, code):
  pass

def verify_email_handler(email, code):
  try:
    verification_code: VerificationCode = VerificationCode.query.filter_by(email=email).first()

    if verification_code is None:
      raise DBException("Email address has no verification code. Please resend a code.", 404)
    
    if verification_code.code == code:
      settings.db.session.delete(verification_code)
      settings.db.session.commit()
    else:
      raise DBException("Wrong code. Try again.", 401)
  except exc.SQLAlchemyError:
    raise DBException("Unable to verify email address. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def add_to_cart_handler(user_id, product_id, size_chosen, quantity):
  try:
    user: User = User.query.filter_by(id=user_id).first()
    product: Product = Product.query.filter_by(id=product_id).first()
    size: Size = Size.query.filter_by(product_id=product_id).filter_by(size=size_chosen).first()
  
    if user is None: raise DBException("User does not exist.", 404)
    if product is None: raise DBException("Product does not exist.", 404)
    if size is None: raise DBException("Size does not exist.", 404)
    if size.stock == 0: raise DBException("Size is out of stock.", 404)

    cart_item: CartItem = CartItem.query.filter_by(user_id=user_id, item_id=size.id).first()

    if cart_item is None:
      if quantity > size.stock:
        raise DBException(f"Sorry, you have requested more of {product.name} than the {size.stock} available in this size.", 400)
      
      cart_item: CartItem = CartItem(user_id=user_id, item_id=size.id, quantity=quantity)
      settings.db.session.add(cart_item)
      settings.db.session.commit()
    else:
      if cart_item.quantity + quantity > MAX_ITEM_QUANTITY:
        raise DBException(f"You cannot have more than {MAX_ITEM_QUANTITY} of {product.name} in your cart.", 400)
      elif cart_item.quantity + quantity > size.stock:
        raise DBException(f"Sorry, you have requested more of {product.name} than the {size.stock} available in this size.", 400)
      
      cart_item.quantity += quantity
      settings.db.session.commit()
    
    user_data = user.as_dict()
    return user_data
  except exc.SQLAlchemyError:
    raise DBException("Unable to add product to cart. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def update_item_quantity_handler(user_id, product_id, size_chosen, new_quantity):
  try:
    product: Product = Product.query.filter_by(id=product_id).first()
    size: Size = Size.query.filter_by(product_id=product_id).filter_by(size=size_chosen).first()
    user: User = User.query.filter_by(id=user_id).first()
    cart_item: CartItem = CartItem.query.filter_by(item_id=size.id).filter_by(user_id=user_id).first()

    if size is None: raise DBException("Size does not exist.", 404)
    if user is None: raise DBException("User does not exist.", 404)
    if product is None: raise DBException("Product does not exist.", 404)
    if cart_item is None: raise DBException("Cart item does not exist.", 404)
    
    cart_item.quantity += new_quantity
    settings.db.session.commit()

    user_data = user.as_dict()
    if cart_item.quantity == 0:
      settings.db.session.delete(cart_item)
      settings.db.session.commit()

    return {"user_data": user_data, "cart": get_cart_handler(user_id), "valid": cart_item.quantity <= size.stock}
  except exc.SQLAlchemyError:
    raise DBException("Unable to remove product from cart. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def get_cart_handler(user_id):
  try:
    user: User = User.query.filter_by(id=user_id).first()

    if user is None: 
      raise DBException("User does not exist.", 404)
    
    user_data = CartItem.query.filter_by(user_id=user_id)\
      .join(Size, CartItem.item_id == Size.id)\
      .add_columns(Size.size, Size.stock)\
      .join(Product, Size.product_id == Product.id)\
      .add_columns(Product.id, Product.name, Product.price, Product.thumbnail, Product.sizes)\
      .all()
     
    response = sorted(list(map(lambda x: {
      "quantity": x[0].quantity,
      "product_name": x[4],
      "price": x[5],
      "thumbnail": x[6],
      "courier": x[7],
      "curSize": {
        "size": x[1],
        "id": x[0].item_id,
        "stock": x[2],
      },
      "product_id": x[3]
    }, user_data)), key=lambda x: x["product_name"])
    
    return response
  except exc.SQLAlchemyError:
    raise DBException("Unable to get cart. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def create_order(order_details, user_id, percent_off, shipping):
  total = order_details["subtotal"] - (order_details["subtotal"] * percent_off) + shipping

  order: Order = Order(
    user_id=user_id, 
    date_ordered=datetime.now(), 
    order_status="Order Created", 
    total_cost=total,
    address_line1=order_details["address_line1"],
    address_line2=order_details["address_line2"],
    town_or_city=order_details["town_or_city"],
    postcode=order_details["postcode"],
    mobile_number=order_details["mobile_number"],
    card_end=order_details["card_end"],
    country=order_details["country"],
    delivery_method=order_details["delivery_method"],
    discount=order_details["discount"] if order_details["discount"] != "" else None,
    delivery_instructions=order_details["delivery_instructions"]
  )

  return order

def get_out_of_stock_items(cart_items, out_of_stock_items):
  valid_cart = True
  for item in cart_items:
    size: Size = Size.query.filter_by(id=item[0].item_id).first()

    if size.stock < item[0].quantity:
      out_of_stock_items.append(size.id)
      valid_cart = False

  return valid_cart

def add_order_items(cart_items, order, user, out_of_stock_items):
  valid_cart = get_out_of_stock_items(cart_items, out_of_stock_items)

  if not valid_cart:
    return
  
  for item in cart_items:
    size: Size = Size.query.filter_by(id=item[0].item_id).first()
    size.stock -= item[0].quantity
    settings.db.session.commit()

    order_item: OrderItem = OrderItem(item_id=item[0].item_id, order_id=order.id, quantity=item[0].quantity)
    order.order_items.append(order_item)
    settings.db.session.commit()

    product: Product = Product.query.filter_by(id=item[1]).first()
    product.num_sold += item[0].quantity
    settings.db.session.commit()

    unit_v: ProductBoughtVector = settings.db.session.query(ProductBoughtVector)\
      .filter_by(product_id=item[1], user_id=user.id)\
      .first()
    
    unit_v.bought = 1
    unit_v.times_bought += item[0].quantity
    settings.db.session.commit()

    settings.db.session.delete(item[0])
    settings.db.session.commit()

  for i in range(len(cart_items)):
    for j in range(len(cart_items)):
      if cart_items[i][1] != cart_items[j][1]:
        bought_with: BoughtTogether = settings.db.session.query(BoughtTogether)\
          .filter_by(product_id=cart_items[i][1], bought_with_id=cart_items[j][1])\
          .first()

        if bought_with is None:
          new_pair: BoughtTogether = BoughtTogether(product_id=cart_items[i][1], bought_with_id=cart_items[j][1])
          settings.db.session.add(new_pair)
          settings.db.session.commit()
        else:
          bought_with.frequency += 1
          settings.db.session.commit()
  
def checkout_handler(user_id, order_details):
  try:
    user: User = User.query.filter_by(id=user_id).first()
    discount_code: DiscountCode = settings.db.session.query(DiscountCode).filter_by(name=order_details["discount"]).first()
    shipping: DeliveryMethod = settings.db.session.query(DeliveryMethod).filter_by(name=order_details["delivery_method"]).first()

    if user is None: 
      raise DBException("User does not exist.", 404)
    
    if shipping is None:
      raise DBException("Delivery method does not exist.", 404)
    
    if discount_code is None and order_details["discount"] != "":
      raise DBException("Discount code does not exist.", 404)
    
    cart_items = CartItem.query.filter_by(user_id=user_id)\
      .join(Size, CartItem.item_id == Size.id)\
      .add_columns(Size.product_id, Size.stock)\
      .join(Product, Size.product_id == Product.id).all()
    
    if len(cart_items) == 0:
      raise DBException("You must have at least one item in your bag to checkout.", 400)
    
    out_of_stock_items = []
    order = create_order(order_details, user_id, discount_code.percent_off if discount_code else 0, shipping.price)
    settings.db.session.add(order)
    settings.db.session.commit()

    add_order_items(cart_items, order, user, out_of_stock_items)
    if len(out_of_stock_items) > 0:
      settings.db.session.delete(order)
      settings.db.session.commit()
      raise DBException(f"""Sorry, but some of your items do not have enough stock to satisfy your order. 
        Please reduce their quantities or remove them from your cart.""", 400, data=out_of_stock_items)
    
    if order.discount:
      discount_used: DiscountJunction = DiscountJunction(user_id=user_id, discount_name=order.discount)
      settings.db.session.add(discount_used)
      settings.db.session.commit()

    return order.id
  except exc.SQLAlchemyError:
    raise DBException("Unable to checkout. Try again.", 500)
  except KeyError:
    raise DBException("Required information missing from order details.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def remove_discount_handler(user_id):
  try:
    user: User = User.query.filter_by(user_id=user_id).first()
    if user is None: 
      raise DBException("User does not exist.", 404)
    
    user.discount_code = None
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to remove discount. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
    
def cancel_order_handler(id, user_id):
  try:
    order: Order = Order.query.filter(Order.id == id).first()

    if order is None: 
      raise DBException("Order not found. Please verify that the order id is correct.", 404)
    if order.cancelled: 
      raise DBException("Order has already been cancelled.", 400)
    
    if order.discount:
      discount_code: DiscountJunction = DiscountJunction.query.filter(
        DiscountJunction.discount_name == order.discount, 
        DiscountJunction.user_id == user_id)\
        .first()
      
      settings.db.session.delete(discount_code)
      settings.db.session.commit()

    order.cancelled = True
    settings.db.session.commit()

    for i in range(len(order.order_items)):
      item: Size = Size.query.filter(Size.id == order.order_items[i].item_id).first()
      product: Product = Product.query.filter(Product.id == item.product_id).first()
      item.stock += order.order_items[i].quantity
      settings.db.session.commit()

      product.num_sold -= order.order_items[i].quantity
      settings.db.session.commit()

      unit_v: ProductBoughtVector = settings.db.session.query(ProductBoughtVector)\
        .filter_by(product_id=item.product_id, user_id=user_id)\
        .first()
      
      unit_v.times_bought -= order.order_items[i].quantity
      settings.db.session.commit()

      if unit_v.times_bought == 0:
        unit_v.bought = 0
        settings.db.session.commit()

      for j in range(len(order.order_items)):
        paired_item: Size = Size.query.filter(Size.id == order.order_items[j].item_id).first()

        if product.id != paired_item.product_id:
          bought_with: BoughtTogether = settings.db.session.query(BoughtTogether)\
            .filter_by(product_id=item.product_id, bought_with_id=paired_item.product_id)\
            .first()
          
          bought_with.frequency -= 1
          settings.db.session.commit()

          if bought_with.frequency == 0:
            settings.db.session.delete(bought_with)
            settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to update order status. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def buy_it_again_handler(user_id, limit):
  try:
    products_bought: ProductBoughtVector = settings.db.session.query(ProductBoughtVector)\
      .filter(ProductBoughtVector.user_id == user_id, ProductBoughtVector.bought == 1)\
      .order_by(ProductBoughtVector.times_bought.desc())\
      .all()
    
    recommended = []
    for i in range(min(len(products_bought), limit)):
      product: Product = settings.db.session.query(Product).filter(Product.id == products_bought[i].product_id).first()
      recommended.append(product.card_details())

    return recommended
  except exc.SQLAlchemyError:
    raise DBException("Failed to load product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def apply_discount_handler(code_name, user_id):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()
    discount_used: DiscountJunction = DiscountJunction.query.filter_by(user_id=user_id, discount_name=code_name).first()

    if discount_code is None: raise DBException("Discount code does not exist.", 404)
    if discount_used is not None: raise DBException("You have already used this discount code in a different order.", 400)
    return discount_code.as_dict()
  except exc.SQLAlchemyError:
    raise DBException("Failed to get discount code.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e