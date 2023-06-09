import bcrypt
import settings
from db.Schema import User, Product, Size, CartItem, Order, OrderItem, DiscountCode, DiscountJunction, ProductBoughtVector, BoughtTogether
from sqlalchemy import exc
from middleware.Authentication import generate_auth_token
from db.Schema import VerificationCode
from datetime import datetime, timedelta
from CustomExceptions.DBException import DBException

MAX_ITEM_QUANTITY = 10

def login_handler(email, password):
  try:
    user: User = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.checkpw(password.encode('utf-8'), user.hash):
      raise DBException("Invalid email or password", 401)
    
    user_data = user.as_dict()
    auth_token = generate_auth_token(user_data)
    return (auth_token, user_data)
  except exc.SQLAlchemyError:
    raise DBException("Unable to check login credentials. Try again.", 500)

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
  except exc.SQLAlchemyError:
    raise DBException("Unable to create user. Try again.", 500)

def hash_password(password):
  bytes = password.encode('utf-8')
  salt = bcrypt.gensalt()
  hash = bcrypt.hashpw(bytes, salt)
  return hash

def find_user_handler(email):
  try:
    user: User = User.query.filter_by(email=email).first()

    if user is None: 
      return ""
    
    user_data = user.as_dict()
    return {"email": user_data["email"]}
  except Exception:
    raise DBException("Unable to check sign up credentials. Try again.", 500)
  
def send_code_handler(email, code):
  send_email(email, code)

  try:
    verificationCode: VerificationCode = VerificationCode.query.filter_by(email=email).first()

    if verificationCode is None:
      newCode = VerificationCode(email=email, code=code, date_created=datetime.now())
      settings.db.session.add(newCode)
    else:
      verificationCode.code = code

    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to create verification code. Try again.", 500)

def send_email(email, code):
  print(code)

def verify_email_handler(email, code):
  try:
    verificationCode: VerificationCode = VerificationCode.query.filter_by(email=email).first()

    if verificationCode is None:
      raise DBException("Email address has no verification code. Please resend a code.", 404)
    
    if verificationCode.code == code:
      settings.db.session.delete(verificationCode)
      settings.db.session.commit()
    else:
      raise DBException("Wrong code. Try again.", 401)
  except exc.SQLAlchemyError:
    raise DBException("Unable to verify email address. Try again.", 500)

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
        raise DBException(f"Limit of {MAX_ITEM_QUANTITY} of the same item reached.", 400)
      elif cart_item.quantity + quantity > size.stock:
        raise DBException(f"Sorry, you have requested more of {product.name} than the {size.stock} available in this size.", 400)
      
      cart_item.quantity += quantity
      settings.db.session.commit()
    
    user_data = user.as_dict()
    auth_token = generate_auth_token(user_data)
    return {"token": auth_token, "user_data": user_data}
  except exc.SQLAlchemyError:
    raise DBException("Unable to add product to cart. Try again.", 500)
  
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

    if cart_item.quantity <= 0:
      settings.db.session.delete(cart_item)
      settings.db.session.commit()

    user_data = user.as_dict()
    auth_token = generate_auth_token(user_data)
    return {"token": auth_token, "user_data": user_data, "cart": get_cart_handler(user_id), "valid": cart_item.quantity <= size.stock}
  except exc.SQLAlchemyError:
    raise DBException("Unable to remove product from cart. Try again.", 500)

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
  
def create_order(order_details, user_id):
  order: Order = Order(
    user_id=user_id, 
    date_ordered=datetime.now(), 
    order_status="Order Created", 
    total_cost=order_details["total_cost"],
    address_line1=order_details["address_line1"],
    address_line2=order_details["address_line2"],
    town_or_city=order_details["town_or_city"],
    postcode=order_details["postcode"],
    mobile_number=order_details["mobile_number"],
    card_end=order_details["card_end"],
    country=order_details["country"],
    delivery_method=order_details["delivery_method"],
    discount=order_details["discount"],
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
    settings.db.session.add(order_item)

    product: Product = Product.query.filter_by(id=item[1]).first()
    product.num_sold += item[0].quantity
    settings.db.session.commit()

    if item[1] not in user.purchased_products:
      user.purchased_products.append(product)
      settings.db.session.commit()

    unit_v: ProductBoughtVector = settings.db.session.query(ProductBoughtVector).filter_by(product_id=item[1], user_id=user.id).first()
    unit_v.bought = 1
    settings.db.session.commit()

    settings.db.session.delete(item[0])
    settings.db.session.commit()

  for i in range(len(cart_items)):
    for j in range(len(cart_items)):
      if i != j:
        bought_with: BoughtTogether = settings.db.session.query(BoughtTogether).filter_by(product_id=cart_items[i][1], bought_with_id=cart_items[j][1]).first()

        if bought_with is None:
          new_pair: BoughtTogether = BoughtTogether(product_id=cart_items[i][1], bought_with_id=cart_items[j][1])
          settings.db.session.add(new_pair)
          settings.db.session.commit()
        else:
          bought_with.frequency += 1
          settings.db.session.commit()
  
def checkout_cart_handler(user_id, order_details):
  try:
    user: User = User.query.filter_by(id=user_id).first()
    if user is None: 
      raise DBException("User does not exist.", 404)
    
    cart_items = CartItem.query.filter_by(user_id=user_id)\
      .join(Size, CartItem.item_id == Size.id)\
      .add_columns(Size.product_id, Size.stock)\
      .join(Product, Size.product_id == Product.id).all()
    
    out_of_stock_items = []
    order = create_order(order_details, user_id)
    settings.db.session.add(order)
    settings.db.session.commit()

    add_order_items(cart_items, order, user, out_of_stock_items)
    if len(out_of_stock_items) > 0:
      settings.db.session.delete(order)
      settings.db.session.commit()
      raise DBException(f"Sorry, but some of your items are now out of stock. Please refresh and try again.", 400, data=out_of_stock_items)
    
    if order.discount != "":
      discount_used: DiscountJunction = DiscountJunction(user_id=user_id, discount_name=order.discount)
      settings.db.session.add(discount_used)
      settings.db.session.commit()

    token = generate_auth_token(user.as_dict())
    return {"token": token, "id" : order.id}
  except exc.SQLAlchemyError:
    raise DBException("Unable to checkout. Try again.", 500)
  except KeyError:
    raise DBException("Important information missing from order details", 400)
  
def apply_discount_handler(code_name, user_id):
  try:
    user: User = User.query.filter_by(id=user_id).first()
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()

    if user is None: raise DBException("User does not exist", 404)
    if discount_code is None: raise DBException("Discount code does not exist", 404)

    settings.db.session.commit()
    return discount_code.as_dict()
  except exc.SQLAlchemyError:
    raise DBException("Unable to apply discount. Try again.", 500)

def remove_discount_handler(user_id):
  try:
    user: User = User.query.filter_by(user_id=user_id).first()
    if user is None: raise DBException("User does not exist", 404)
    
    user.discount_code = None
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to remove discount. Try again.", 500)
    
def cancel_order_handler(id, user_id):
  try:
    order: Order = Order.query.filter(Order.id == id).first()

    if order is None: 
      raise DBException("Order not found. Please verify that the order id is correct", 404)
    if order.cancelled: 
      raise DBException("Order has already been cancelled", 400)
    
    if order.discount != "":
      discount_code: DiscountJunction = DiscountJunction.query.filter(
        DiscountJunction.discount_name == order.discount, 
        DiscountJunction.user_id == user_id)\
        .first()
      
      settings.db.session.delete(discount_code)
      settings.db.session.commit()

    order.cancelled = True
    settings.db.session.commit()

    order_items = OrderItem.query.filter(OrderItem.order_id == order.id).all()

    for order_item in order_items:
      item: Size = Size.query.filter(Size.id == order_item.item_id).first()
      item.stock += order_item.quantity
      settings.db.session.commit()

  except exc.SQLAlchemyError:
    raise DBException("Unable to update order status. Try again.", 500)