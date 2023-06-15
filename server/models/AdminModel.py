from db.Schema import Admin
from utils.HashPassword import hash_password
import settings

from sqlalchemy import exc
from middleware.Authentication import generate_auth_token
from CustomExceptions.DBException import DBException
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def login_handler(email, password):
  try:
    admin: Admin = Admin.query.filter_by(email=email).first()

    if admin is None or not bcrypt.check_password_hash(admin.hash, password):
      raise DBException("Invalid email or password", 401)
    
    admin_data = admin.as_dict()
    auth_token = generate_auth_token(admin_data, "ADMIN_JWT_SECRET_KEY")
    return (auth_token, admin_data)
  except exc.SQLAlchemyError:
    raise DBException("Failed to check login credentials. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def create_admin_handler(email, password):
  try:
    hash = hash_password(password)
    new_admin = Admin(email=email, hash=hash)
    settings.db.session.add(new_admin)
    settings.db.session.commit()
  except exc.SQLAlchemyError as e:
    print(e)
    raise DBException("Failed to create admin account. Try again.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e