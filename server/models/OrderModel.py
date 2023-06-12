from db.Schema import Order, OrderItem, Size, Product, DiscountJunction
from sqlalchemy import exc
from CustomExceptions.DBException import DBException 
from datetime import datetime
import settings

order_status = {"Order Created", "Processing", "Shipped", "Delivered", "Cancelled"}
filter_options = {"active", "arrived", "pending", "cancelled"}

def format_order_items(order_id): 
  order_items = OrderItem.query.filter_by(order_id=order_id)\
    .join(Size, OrderItem.item_id == Size.id)\
    .add_columns(Size.size)\
    .join(Product, Size.product_id == Product.id)\
    .add_columns(Product.name, Product.price, Product.thumbnail, Product.id)\
    .all()
  
  return sorted(list(map(lambda x: {
    "quantity": x[0].quantity,
    "product_name": x[2],
    "price": x[3],
    "thumbnail": x[4],
    "size": x[1],
    "product_id": x[5]
  }, order_items)), key=lambda x: x["product_name"])

def get_order_handler(id, user_id):
  try:
    order = Order.query.filter_by(id=id).first()

    if order is None or order.user_id != user_id:
      raise DBException("Order id does not exist or is not associated with your account. Please verify that you entered it correctly.", 404)
    
    return {
      "order_details": order.as_dict(),
      "items": format_order_items(order.id)
    }
  except exc.SQLAlchemyError:
    raise DBException("Unable to check order number. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def get_orders_handler(user_id, search, page, limit, filter):
  if filter not in filter_options:
    raise DBException("Filter option provided is not supported.")

  try:
    orders = settings.db.session.query(Order)\
    .filter(Order.user_id == user_id)\
    .filter(Order.id.ilike('%' + search + '%'))\
    .order_by(Order.date_ordered.desc())

    if filter == "arrived": orders = orders.filter(Order.delivered_date != None)
    elif filter == "pending": orders = orders.filter(Order.delivered_date == None, Order.cancelled == False)
    elif filter == "cancelled": orders = orders.filter(Order.cancelled == True)
    else: orders = orders.filter(Order.cancelled == False)

    orders = settings.db.paginate(orders, page=page, per_page=limit)
    items = list([{
      "order_details": order.as_dict(),
      "items": format_order_items(order.id)
    } for order in orders.items])

    return {
      "next": items,
      "meta": {
        "page": orders.page,
        "pages": orders.pages,
        "total_count": orders.total,
        "prev_page": orders.prev_num,
        "next_page": orders.next_num,
        "has_next": orders.has_next,
        "has_prev": orders.has_prev
      }
    }
  except exc.SQLAlchemyError:
    raise DBException("Unable to load your orders. Try again.", 500)
  except KeyError:
    raise DBException("Invalid sort query parameter specified.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def update_order_status_handler(id, status):
  try:
    date = datetime.now()
    order: Order = Order.query.filter(Order.id == id).first()

    if order is None:
      raise DBException("Order not found. Please verify that the order id is correct.", 404)
    
    if status not in order_status:
      raise DBException("Invalid order status provided.", 400)
    
    if order.cancelled:
      raise DBException("This order has already been cancelled.", 400)
    
    if status == "Order Created":
      order.date_ordered = date
      order.processing_date = order.shipped_date = order.delivered_date = None
    elif status == "Processing":
      if order.date_ordered is None: order.date_ordered = date
      order.processing_date = date
      order.shipped_date = order.delivered_date = None
    elif status == "Shipped":
      if order.date_ordered is None: order.date_ordered = date
      if order.processing_date is None: order.processing_date = date
      order.shipped_date = date
      order.delivered_date = None
    else:
      if order.date_ordered is None: order.date_ordered = date
      if order.shipped_date is None: order.shipped_date = date
      if order.processing_date is None: order.processing_date = date
      order.delivered_date = date
    
    order.order_status = status
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Unable to update order status. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e