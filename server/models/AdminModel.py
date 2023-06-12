import bcrypt
from db.Schema import Admin
from utils.HashPassword import hash_password
import settings

from sqlalchemy import exc
from middleware.Authentication import generate_auth_token
from CustomExceptions.DBException import DBException

def login_handler(email, password):
  try:
    admin: Admin = Admin.query.filter_by(email=email).first()

    if admin is None or not bcrypt.checkpw(password.encode('utf-8'), admin.hash):
      raise DBException("Invalid email or password", 401)
    
    admin_data = admin.as_dict()
    auth_token = generate_auth_token(admin_data, "ADMIN_JWT_SECRET_KEY")
    return (auth_token, admin_data)
  except exc.SQLAlchemyError:
    raise DBException("Failed to check login credentials. Try again.", 500)
  except Exception:
    raise DBException("Something went wrong. Please contact our team if this continues.", 500)
  
def create_admin_handler(email, password):
  try:
    hash = hash_password(password)
    new_admin = Admin(email=email, hash=hash)
    settings.db.session.add(new_admin)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to create admin account. Try again.", 500)
  except Exception:
    raise DBException("Something went wrong. Please contact our team if this continues.", 500)