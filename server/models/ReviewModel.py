from db.Schema import Review, Product, User, HelpfulReview, Order, OrderItem, Size
import settings
from sqlalchemy import exc
from CustomExceptions.DBException import DBException

def get_reviews_handler(product_id, sort, search, page, limit, asc, user_id):
  try:
    reviews = settings.db.paginate(settings.db.session.query(Review)
      .filter(Review.title.ilike('%' + search + '%'))
      .filter(Review.product_id == product_id)
      .order_by(Review.sort_by_params()[sort] if asc == "true" else Review.sort_by_params()[sort].desc()),
      page=page, per_page=limit)
    
    result = []
    for review in reviews.items:
      is_marked: HelpfulReview = settings.db.session.query(HelpfulReview).filter(HelpfulReview.review_id == review.id).filter(HelpfulReview.user_id == user_id).first()
      if is_marked is None: result.append(review.as_dict(False, review.user_id == user_id))
      else: result.append(review.as_dict(True, review.user_id == user_id))

    return {
      "next": result,
      "meta": {
        "page": reviews.page,
        "pages": reviews.pages,
        "total_count": reviews.total,
        "prev_page": reviews.prev_num,
        "next_page": reviews.next_num,
        "has_next": reviews.has_next,
        "has_prev": reviews.has_prev
      }
    }
  except exc.SQLAlchemyError:
    raise DBException("Failed to get products", 500)
  except KeyError:
    raise DBException("Invalid sort query parameter specified", 400)
  except Exception:
    raise DBException("Resource not found. This could be due to specifying an out of range page number or a product that doesn't exist", 404)
  
def delete_review_handler(id):
  try:
    review: Review = settings.db.session.query(Review).filter(Review.id == id).first()
    product: Product = settings.db.session.query(Product).filter(Product.id == review.product_id).first()

    if review is None:
      raise DBException("Review not found", 404)
    
    product.num_reviews -= 1
    settings.db.session.commit()

    product.ratings -= review.rating
    settings.db.session.commit()

    if product.num_reviews > 0:
      product.rating = product.ratings / product.num_reviews
      settings.db.session.commit()
    else:
      product.rating = 0
      settings.db.session.commit()

    settings.db.session.delete(review)
    settings.db.session.commit()
  except exc.SQLAlchemyError:
    raise DBException("Failed to delete review", 500)

def add_helpful_count_handler(id, user_id):
  try:
    has_marked: HelpfulReview = settings.db.session.query(HelpfulReview)\
      .filter(HelpfulReview.review_id == id)\
      .filter(HelpfulReview.user_id == user_id)\
      .first()

    if has_marked is None:
      helpful = HelpfulReview(review_id=id, user_id=user_id)
      settings.db.session.add(helpful)
      settings.db.session.commit()

      review: Review = settings.db.session.query(Review).filter(Review.id == id).first()
      review.helpful_count = review.helpful_count + 1
      settings.db.session.commit()
      return review.helpful_count
    else:
      raise DBException("You have already marked this review as helpful", status_code=409)
  except exc.SQLAlchemyError:
    raise DBException("Failed to add helpful count", 500)

def add_review_handler(product_id, user_id, data):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()
    user: User = settings.db.session.query(User).filter(User.id == user_id).first()
    
    if product is None or user is None:
      raise DBException("Product or user does not exist", status_code=404)
    
    for review in product.reviews:
      if review.user_id == user_id:
        raise DBException("You have already reviewed this product", status_code=409)
    
    has_purchased_product = settings.db.session.query(Order).filter(Order.user_id == user_id, Order.delivered_date != None)\
      .join(OrderItem, OrderItem.order_id == Order.id)\
      .join(Size, Size.id == OrderItem.item_id)\
      .join(Product, Product.id == Size.product_id)\
      .filter(Product.id == product_id)\
      .first()

    new_review = Review(user_id=user_id, product_id=product_id, rating=data["rating"], title=data["title"], review=data["review"])
    if has_purchased_product is not None:
      new_review.verified_purchase = True

    settings.db.session.add(new_review)
    settings.db.session.commit()

    product.num_reviews = product.num_reviews + 1
    product.ratings = product.ratings + data["rating"]
    product.rating = product.ratings / product.num_reviews
    settings.db.session.commit()
  except exc.SQLAlchemyError as e:
    raise DBException(str(e), status_code=500)
  except KeyError:
    raise DBException("Missing required fields", status_code=400)