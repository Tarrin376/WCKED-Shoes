from db.Schema import DiscountCode, DiscountJunction
from CustomExceptions.DBException import DBException 
import settings
from sqlalchemy import exc

def expire_discount_code_handler(code_name):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()
    if discount_code is None: 
      raise DBException("Discount code does not exist.", 404)
    
    if discount_code.is_expired:
      raise DBException("Discount code is already expired.", 400)
    
    discount_code.is_expired = True
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to delete discount code.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def create_discount_code_handler(code_name, percent_off):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()

    if discount_code is not None:
      raise DBException(f"Discount code {code_name} already exists.", 400)
    
    if percent_off < 0 or percent_off > 1:
      raise DBException("Discount code percentage must be between 0 and 1.", 400)
    
    new_discount_code = DiscountCode(name=code_name, percent_off=percent_off)
    settings.db.session.add(new_discount_code)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to create discount code.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e