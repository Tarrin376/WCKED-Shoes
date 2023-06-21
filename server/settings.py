from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate
import redis
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "https://e-commerce-app-k88h.onrender.com"}}, supports_credentials=True)

prodURI = os.environ['DATABASE_URI']
prodURI = prodURI.replace("postgres://", "postgresql://")

app.config['SQLALCHEMY_DATABASE_URI'] = prodURI
app.config['SECRET_KEY'] = os.environ['APP_SECRET_KEY']

@app.route('/', defaults={'path': '../client/build/index.html'})
@app.route('/<path:path>')
def catch_all(path):
    return render_template(path)

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