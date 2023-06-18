from db.Schema import Review, Product, User, HelpfulReview, Order, OrderItem, Size
import settings
from sqlalchemy import exc
from CustomExceptions.DBException import DBException

def get_reviews_handler(product_id, sort, page, limit, asc, user_id, filter):
  try:
    user: User = settings.db.session.query(User).filter(User.id == user_id).first()
    if user is None:
      raise DBException("User not found", 404)
    
    reviews = settings.db.session.query(Review)\
      .filter(Review.product_id == product_id)\
      .order_by(Review.sort_by_params()[sort] if asc == "true" else Review.sort_by_params()[sort].desc())
    
    if filter == "verified": 
      reviews = reviews.filter(Review.verified_purchase == True)

    reviews = settings.db.paginate(reviews, page=page, per_page=limit)
    result = []

    for review in reviews.items:
      marked = False

      for helpful in user.found_helpful:
        if helpful.review_id == review.id:
          marked = True
          break
      
      result.append(review.as_dict(marked, review.user_id == user_id))

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
    raise DBException("Failed to get products.", 500)
  except KeyError:
    raise DBException("Invalid sort query parameter specified.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e
  
def delete_review_handler(id):
  try:
    review: Review = settings.db.session.query(Review).filter(Review.id == id).first()

    if review is None:
      raise DBException("Review not found.", 404)
    
    product: Product = settings.db.session.query(Product).filter(Product.id == review.product_id).first()
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
    raise DBException("Failed to delete review.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def mark_helpful_handler(id, user_id):
  try:
    review: Review = settings.db.session.query(Review).filter(Review.id == id).first()
    user: User = settings.db.session.query(User).filter(User.id == user_id).first()

    if review is None:
      raise DBException("Review not found", 404)
    
    if user is None:
      raise DBException("User not found", 404)

    if review not in user.found_helpful:
      helpful = HelpfulReview(review_id=id, user_id=user_id)
      review.found_helpful.append(helpful)
      settings.db.session.commit()

      review.helpful_count += 1
      settings.db.session.commit()

      user.found_helpful.append(helpful)
      settings.db.session.commit()
      return review.helpful_count
    else:
      raise DBException("You have already marked this review as helpful.", 409)
  except exc.SQLAlchemyError:
    raise DBException("Failed to add helpful count.", 500)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e

def add_review_handler(product_id, user_id, data):
  try:
    product: Product = settings.db.session.query(Product).filter(Product.id == product_id).first()
    user: User = settings.db.session.query(User).filter(User.id == user_id).first()
    
    if product is None or user is None:
      raise DBException("Product not found.", 404)
    
    if user is None:
      raise DBException("User not found", 404)
    
    for review in product.reviews:
      if review.user_id == user_id:
        raise DBException("You have already reviewed this product.", 409)
    
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
    settings.db.session.commit()

    product.ratings = product.ratings + data["rating"]
    settings.db.session.commit()

    product.rating = product.ratings / product.num_reviews
    settings.db.session.commit()
    return new_review.as_dict(False, True)
  except exc.SQLAlchemyError as e:
    print(e)
    raise DBException("Failed to add review.", 500)
  except KeyError:
    raise DBException("Missing required fields.", 400)
  except Exception as e:
    if type(e) is not DBException:
      raise DBException("Something went wrong. Please contact our team if this continues.", 500)
    else:
      raise e