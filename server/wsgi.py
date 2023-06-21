import os
from settings import app
from server import server_blueprint

def run_app():
  port = int(os.environ.get('PORT', 8080))
  bind = f"0.0.0.0:{port}"
  cmd = f"gunicorn --bind {bind} wsgi:app"
  os.system(cmd)

app.register_blueprint(server_blueprint, url_prefix="/api")

if __name__ == '__main__':
  run_app()