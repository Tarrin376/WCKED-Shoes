import { TReview } from "../../@types/TReview";
import RatingStars from "../../components/RatingStars";
import { convertDate } from "../../utils/convertDate";
import Rating from "../../components/Rating";
import { usePagination } from "../../hooks/usePagination";
import { useState } from "react";
import { TReviewOptions } from "../../@types/TReviewOptions";
import { orderReviews } from "../../utils/orderReviews";
import { TProduct } from "../../@types/TProduct";
import OrderByOptions from "../../components/OrderByOptions";
import ReviewsLoading from "../../loading/ReviewsLoading";
import axios from "axios";

interface Props {
  product: TProduct;
}

const reviewsLimit = 4;

const Reviews: React.FC<Props> = ({ product }) => {
  const getReviews = usePagination<TReview, TReviewOptions>(orderReviews, reviewsLimit, `/reviews/${product.id}`, "", "");

  return (
    <div className="light-component dark:gray-component p-5 pt-3 2xl:w-[65%] max-2xl:w-[60%] max-xl:w-full relative">
      <h4 className="text-[21px] mb-3 font-semibold">Rating & Reviews</h4>
      <div className="flex items-center gap-4 mb-4">
        <p className="text-side-text-light dark:text-side-text-gray mb-[3px]">{`Reviews (${product.num_reviews})`}</p>
        <Rating rating={product.rating} />
      </div>
      <select className={`px-4 !rounded-[5px] light-component dark:gray-component w-[190px] cursor-pointer h-[40px] !shadow-none`}
      onChange={(e) => getReviews.handleSort(e.currentTarget.selectedIndex)} value={getReviews.sort.label}>
        <OrderByOptions options={orderReviews} />
      </select>
      {getReviews.errorMessage.length === 0 ?
      <div className={`mt-4 ${getReviews.reachedLimit ? 'h-[425px]' : 'h-[445px]'} overflow-y-scroll pr-5`}>
        <div className="flex flex-col gap-4">
          {getReviews.next.map((review, index) => {
            return (
              <Review 
                review={review} 
                key={index} 
              />
            )
          })}
          {getReviews.loading && <ReviewsLoading limit={reviewsLimit} />}
          {getReviews.reachedLimit && 
          <p className="text-side-text-light dark:text-side-text-gray text-center">
            {getReviews.totalFound === 0 ? "Be the first to write a review on this product!" : "No more reviews for this product"}
          </p>}
        </div>
        {!getReviews.reachedLimit && !getReviews.loading &&
        <button className="secondary-btn w-[170px] h-[40px] cursor-pointer m-auto block mt-6 mb-6"
        onClick={getReviews.handlePage}>
          Read More Reviews
        </button>}
      </div> :
      <div className="absolute w-full h-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center
      backdrop-filter backdrop-blur-sm bg-[#bbbbbb09] dark:bg-[#1c1c1ca6]">
        <p className="text-[19px] text-center font-semibold bg-opacity-70 p-2 rounded-[8px]">
          You must be logged in to see reviews of this product.
        </p>
      </div>}
    </div>
  )
};

const Review: React.FC<{ review: Readonly<TReview> }> = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [disabled, setDisabled] = useState(false);
  
  const addHelpfulCount = async () => {
    try {
      const countResponse = await axios.put<string>(`/reviews/${review.id}/helpful`);
      setHelpfulCount(parseInt(countResponse.data));
      setDisabled(true);
    }
    catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="border-b border-b-light-border dark:border-b-main-gray-border pb-6">
      <div className="flex max-md:flex-col md:items-center md:gap-4">
        <h5 className="text-main-text-black dark:text-main-text-white font-semibold">{review.title}</h5>
        <p className="text-side-text-light dark:text-side-text-gray text-[15px]">{`Posted on ${convertDate(review.date_posted)}`}</p>
      </div>
      <RatingStars rating={review.rating} />
      <p className="text-main-text-black dark:text-main-text-white">{review.review}</p>
      {review.helpful_count > 0 && 
      <p className="text-side-text-light dark:text-side-text-gray mt-2 text-[15px]">
        {`${review.helpful_count === 1 ? 'One person' : `${helpfulCount} people`} found this review helpful`}
      </p>}
      <button className={`secondary-btn w-[80px] h-[30px] mt-3 text-[15px] ${review.is_marked || disabled ? "hidden" : ""}`}
      onClick={addHelpfulCount}>
        Helpful
      </button>
    </div>
  )
}

export default Reviews;