class DBException(Exception):
  def __init__(self, message, status_code, data=None):
    self.message = message
    self.status_code = status_code
    self.data = data