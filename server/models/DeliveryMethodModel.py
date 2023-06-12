from db.Schema import DeliveryMethod
from CustomExceptions.DBException import DBException 
import settings
from sqlalchemy import exc

def add_delivery_method_handler(method_data):
  try:
    name = method_data["name"]
    estimated_lower_days = method_data["estimated_lower_days"]
    estimated_higher_days = method_data["estimated_higher_days"]
    price = method_data["price"]

    find_method: DeliveryMethod = DeliveryMethod.query.filter_by(name=name).first()
    if find_method:
      raise DBException("Delivery method already exists.", 400)
    
    if estimated_lower_days > estimated_higher_days:
      raise DBException("Delivery interval is invalid.", 400)
    
    new_delivery_method = DeliveryMethod(
      name=name, estimated_lower_days=estimated_lower_days, 
      estimated_higher_days=estimated_higher_days, price=price)
    
    settings.db.session.add(new_delivery_method)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to create delivery method.", 500)
  except KeyError:
    raise DBException("Delivery method is missing required fields.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def delete_delivery_method_handler(name):
  try:
    method: DeliveryMethod = DeliveryMethod.query.filter_by(name=name).first()

    if method is None:
      raise DBException("Delivery method could not be found.", 404)
    
    settings.db.session.delete(method)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to delete delivery method.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def get_delivery_methods_handler():
  try:
    delivery_methods = DeliveryMethod.query.all()
    return [method.as_dict() for method in delivery_methods]
  except exc.SQLAlchemyError:
    raise DBException("Failed to load delivery methods.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e