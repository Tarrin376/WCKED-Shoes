from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate
import redis

load_dotenv()

app = Flask(__name__, static_folder="../client/build", static_url_path='../client/build/static')
prodURI = os.environ['DATABASE_URI']
prodURI = prodURI.replace("postgres://", "postgresql://")

app.config['SQLALCHEMY_DATABASE_URI'] = prodURI
app.config['SECRET_KEY'] = os.environ['APP_SECRET_KEY']

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
  return send_from_directory('../client/build', 'index.html')

db = SQLAlchemy()
migrate = Migrate(app, db)
db.init_app(app)

limiter = Limiter(
  get_remote_address,
  app=app,
  storage_uri=os.environ['REDIS_STORAGE_URI'],
  storage_options={"socket_connect_timeout": 30},
  strategy="fixed-window"
)

redis_client = redis.Redis.from_url(os.environ['REDIS_STORAGE_URI'])