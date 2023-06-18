from settings import redis_client
import json
import socket
import redis

DEFAULT_EXPIRATION = 420

def get_ip():
  try:
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return ip_address
  except socket.error:
    return None

def cache(url, handler, expires, *args):
  ip = get_ip()
  data = None

  try:
    if ip:
      key = f"{ip}@{url}"
      found = redis_client.get(key)
      if found:
        data = json.loads(found)
      else: 
        data = handler(*args)
        redis_client.setex(key, expires, json.dumps(data))
    else:
      data = handler(*args)
  except redis.RedisError:
    data = handler(*args)
  
  return data