from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

global app
app = Flask(__name__)
global db
db = SQLAlchemy()

global limiter
limiter = Limiter(
  get_remote_address,
  app=app,
  default_limits=["1000 per day", "1000 per hour"]
)