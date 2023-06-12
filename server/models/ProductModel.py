from db.Schema import Product, ProductImage, Size, User, ProductBoughtVector, BoughtTogether
import settings
from sqlalchemy import exc
from CustomExceptions.DBException import DBException
import numpy as np
import math

def create_product_handler(product):
  try:
    description = product["description"]
    price = product["price"]
    carbon_footprint = product["carbon_footprint"]
    name = product["name"]
    images = product["images"]
    thumbnail = product["thumbnail"]
    sizes = product["sizes"]

    new_product = Product(
      description=description, price=price, carbon_footprint=carbon_footprint, 
      name=name, thumbnail=thumbnail)
    
    settings.db.session.add(new_product)
    settings.db.session.commit()
    
    for image in images:
      settings.db.session.add(ProductImage(product_id=new_product.id, image_url=image))

    settings.db.session.commit()

    for size in sizes:
      size_val = size["size"]
      stock = size["stock"]
      settings.db.session.add(Size(product_id=new_product.id, size=size_val, stock=stock))

    settings.db.session.commit()
    create_product_vector(new_product.id)
  except exc.SQLAlchemyError:
    raise DBException("Failed to create product.", 500)
  except KeyError:
    raise DBException("Product is missing required fields.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def create_product_vector(product_id):
  users = settings.db.session.query(User).all()

  for user in users:
    unit_v: ProductBoughtVector = ProductBoughtVector(product_id=product_id, user_id=user.id)
    settings.db.session.add(unit_v)
    settings.db.session.commit()

def get_products_handler(sort, search, page, limit, asc):
  try:
    products = settings.db.paginate(settings.db.session.query(Product)
      .filter(Product.name.ilike('%' + search + '%'))
      .order_by(Product.sort_by_params()[sort] if asc == "true" else Product.sort_by_params()[sort].desc()),
      page=page, per_page=limit)

    return {
      "next": products.items,
      "meta": {
        "page": products.page,
        "pages": products.pages,
        "total_count": products.total,
        "prev_page": products.prev_num,
        "next_page": products.next_num,
        "has_next": products.has_next,
        "has_prev": products.has_prev
      }
    }
  except exc.SQLAlchemyError:
    raise DBException("Failed to get products.", 500)
  except KeyError:
    raise DBException("Invalid sort query parameter specified.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def get_product_handler(product_id):
  try:
    product: Product = settings.db.session.query(Product)\
     .filter(Product.id == product_id)\
     .first()
    
    if product is None:
      raise DBException("Product not found.", 404)
    
    return product
  except exc.SQLAlchemyError:
    raise DBException("Failed to get product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def check_size_stock_handler(product_id, size):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()

    if product is None:
      raise DBException("Product not found.", 404)
    
    size: Size = settings.db.session.query(Size).filter(Size.product_id == product.id).filter(Size.size == size).first()

    if size is None:
      raise DBException("Size not found.", 404)
    
    return { "inStock": size.stock > 0 }
  except exc.SQLAlchemyError:
    raise DBException("Failed to check size stock.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def update_product_handler(product_id, product):
  pass

def delete_product_handler(product_id):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()

    if product is None:
      raise DBException("Product not found.", 404)
    
    settings.db.session.delete(product)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to delete product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def add_product_image_handler(product_id, image_url):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()
    
    if product is None:
      raise DBException("Product not found.", 404)
    
    settings.db.session.add(ProductImage(product_id=product.id, image_url=image_url))
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to add product image.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def update_product_thumbnail_handler(product_id, thumbnail_url):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()

    if product is None:
      raise DBException("Product not found.", 404)
    
    product.thumbnail = thumbnail_url
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to update product thumbnail.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def recommend_customer_bought_handler(product_id, limit):
  try:
    N = len(settings.db.session.query(User).all())
    target_vector = get_product_vector(product_id, N)
    products = []

    if np.linalg.norm(target_vector) == 0:
      return products

    all_products = settings.db.session.query(Product).all()

    for product in all_products:
      vector = get_product_vector(product.id, N)
      if product.id != product_id:
        vector = get_product_vector(product.id, N)
        angle = get_vector_angle(target_vector, vector)
        products.append([angle, product])
    
    products.sort(key=lambda x: x[0])
    return [product.card_details() for _, product in list(filter(lambda x: x[0] < 90, products[:min(len(products), limit)]))]
  except exc.SQLAlchemyError:
    raise DBException("Failed to load product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def get_vector_angle(u, v):
  u_norm = np.linalg.norm(u)
  v_norm = np.linalg.norm(v)

  if v_norm == 0:
    return 90
  
  theta = np.dot(u, v) / (u_norm * v_norm)
  return math.degrees(math.acos(theta))

def get_product_vector(product_id, N):
  try:
    unit_vectors: list[ProductBoughtVector] = settings.db.session.query(ProductBoughtVector)\
      .filter(ProductBoughtVector.product_id == product_id)\
      .order_by(ProductBoughtVector.user_id)\
      .all()
    
    vector = np.zeros(N)
    for i in range(N):
      vector[i] = unit_vectors[i].bought
    
    return vector
  except exc.SQLAlchemyError:
    raise DBException("Failed to load product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def frequently_bought_together_handler(product_id, limit):
  try:
    bought_with_products: list[BoughtTogether] = settings.db.session.query(BoughtTogether)\
    .filter(BoughtTogether.product_id == product_id)\
    .all()
    
    products = []
    for edge in bought_with_products:
      products.append([edge.bought_with, edge.frequency])
    
    products.sort(key=lambda x: (x[1], x[0].rating), reverse=True)
    res = [product.card_details() for product, _ in products[:min(len(products), limit)]]

    if len(res) == 0:
      return res
    
    res.insert(0, bought_with_products[0].product.card_details())
    return res
  except exc.SQLAlchemyError:
    raise DBException("Failed to load product.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e