from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import redis
import os
from dotenv import load_dotenv

load_dotenv()

global app
app = Flask(__name__)
global db
db = SQLAlchemy()

global redis_client
redis_client = redis.Redis(
  host=os.environ['REDIS_HOST'],
  port=os.environ['REDIS_PORT'],
  password=os.environ['REDIS_PASSWORD']
)