import os
from settings import app
from server import server_blueprint
from flask import Response, send_file

def run_app():
  port = int(os.environ.get('PORT', 8080))
  bind = f"0.0.0.0:{port}"
  cmd = f"gunicorn --bind {bind} wsgi:app"
  os.system(cmd)

def handle_request(environ, start_response):
  return app(environ, start_response)

@app.route('/', defaults={'u_path': ''})
@app.route('/<path:u_path>')
def catch_all(u_path):
  if not u_path.startswith('/api'):
    return send_file(f"{app.static_folder}/index.html")
  
  return Response("API route not found", status=404, mimetype="application/json")

app.register_blueprint(server_blueprint, url_prefix="/api")

if __name__ == '__main__':
  callable = handle_request
  run_app()