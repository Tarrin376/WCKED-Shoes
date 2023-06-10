from db.Schema import DiscountCode, DiscountJunction
from CustomExceptions.DBException import DBException 
import settings
from sqlalchemy import exc

def get_discount_handler(code_name, user_id):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()
    discount_used: DiscountJunction = DiscountJunction.query.filter_by(user_id=user_id, discount_name=code_name).first()

    if discount_code is None: raise DBException("Discount code does not exist.", 404)
    if discount_used is not None: raise DBException("You have already used this discount code in a different order.", 400)
    return discount_code.as_dict()
  except exc.SQLAlchemyError:
    raise DBException("Failed to get discount code.", 500)

def delete_discount_code_handler(code_name):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()
    if discount_code is None: 
      raise DBException("Discount code does not exist.")
    
    settings.db.session.delete(discount_code)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to delete discount code.", 500)

def create_discount_code_handler(code_name, percent_off):
  try:
    discount_code: DiscountCode = DiscountCode.query.filter_by(name=code_name).first()

    if discount_code is not None:
      raise DBException(f"Discount code {code_name} already exists.", status_code=400)
    
    if percent_off < 0 or percent_off > 1:
      raise DBException("Discount code percentage must be between 0 and 1.", status_code=400)
    
    new_discount_code = DiscountCode(name=code_name, percent_off=percent_off)
    settings.db.session.add(new_discount_code)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to create discount code.", 500)