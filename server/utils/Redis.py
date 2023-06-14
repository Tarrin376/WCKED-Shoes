from settings import redis_client
from flask import Response

def rate_limit(count, expires_after, value):
  def _rate_limit(func):
    def __rate_limit(*args, **kwargs):
      key = f"rate-limit:${value}"
      if int(redis_client.incr(key)) > count:
        return Response("Error, too many requests made. Please wait and try again.", status=429, mimetype="text/plain")
      if redis_client.ttl(key) == -1:
        redis_client.expire(key, expires_after)
      
      return func(*args, **kwargs)
    
    __rate_limit.__name__ = func.__name__
    return __rate_limit
  return _rate_limit