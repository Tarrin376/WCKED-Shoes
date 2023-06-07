from flask import Flask
from flask_sqlalchemy import SQLAlchemy

global app
app = Flask(__name__)
global db
db = SQLAlchemy()
