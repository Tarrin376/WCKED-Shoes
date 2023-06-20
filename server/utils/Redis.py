from settings import redis_client
import json
import redis

DEFAULT_EXPIRATION = 300

def cache(key, handler, expires, *args):
  data = None

  try:
    found = redis_client.get(key)
    if found:
      data = json.loads(found)
    else: 
      data = handler(*args)
      if (isinstance(data, list) and len(data) > 0) or not isinstance(data, list):
        redis_client.setex(key, expires, json.dumps(data))
  except redis.exceptions.RedisError:
    data = handler(*args)

  return data