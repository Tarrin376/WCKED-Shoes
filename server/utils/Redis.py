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
      redis_client.setex(key, expires, json.dumps(data))
  except redis.RedisError:
    data = handler(*args)
  
  return data