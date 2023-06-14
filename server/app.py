import os
from settings import app, db
from server import server_blueprint

def run_app():
  app.register_blueprint(server_blueprint, url_prefix="/api")

  # with settings.app.app_context():
  #   settings.db.drop_all()
  #   settings.db.create_all()
  
  app.run(debug=True, port=os.environ['PORT'])

if __name__ == "__main__":
  run_app()