import os
from settings import app
from server import server_blueprint

def run_app():
  app.register_blueprint(server_blueprint, url_prefix="/api")
  app.run(debug=False, port=os.environ.get('PORT') or 8080)

if __name__ == '__main__':
  run_app()