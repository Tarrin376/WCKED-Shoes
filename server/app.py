import os
import settings
from server import server_blueprint

def run_app():
  settings.app.config['SECRET_KEY'] = os.environ['APP_SECRET_KEY']
  DB_NAME = "database.db"

  settings.app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
  settings.app.register_blueprint(server_blueprint, url_prefix="/api")
  settings.db.init_app(settings.app)

  # with settings.app.app_context():
  #   settings.db.drop_all()
  #   settings.db.create_all()
  
  settings.app.run(debug=True, port=os.environ['PORT'])

if __name__ == "__main__":
  run_app()