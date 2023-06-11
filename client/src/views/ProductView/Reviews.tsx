import { TReview } from "../../@types/TReview";
import Rating from "../../components/Rating";
import { usePagination } from "../../hooks/usePagination";
import { useContext } from "react";
import { TReviewOptions } from "../../@types/TReviewOptions";
import { orderReviews } from "../../utils/orderReviews";
import { TProduct } from "../../@types/TProduct";
import OrderByOptions from "../../components/OrderByOptions";
import ReviewsLoading from "../../loading/ReviewsLoading";
import { UserContext } from "../../providers/UserProvider";
import Review from "./Review";
import ErrorMessage from "../../components/ErrorMessage";
import WriteReview from "./WriteReview";

interface Props {
  product: TProduct;
}

const reviewsLimit = 4;

const Reviews: React.FC<Props> = ({ product }) => {
  const userContext = useContext(UserContext);
  const getReviews = usePagination<TReview, TReviewOptions>(orderReviews, reviewsLimit, `/reviews/${product.id}`, "", "");

  return (
    <div className="flex max-xl:flex-col gap-6 max-xl:h-fit max-2xl:h-[630px] pb-2 mt-[40px]">
      <div className="light-component dark:gray-component p-5 pt-3 2xl:w-[65%] max-2xl:w-[60%] max-xl:w-full relative">
        <h4 className="text-[21px] mb-3 font-semibold">Rating & Reviews</h4>
        <div className="flex items-center gap-4 mb-4">
          <p className="text-side-text-light dark:text-side-text-gray mb-[3px]">{`Reviews (${product.num_reviews})`}</p>
          {userContext?.email !== "" && <Rating rating={product.rating} />}
        </div>
        <select className={`px-4 !rounded-md light-component dark:gray-component w-[190px] cursor-pointer h-[40px] !shadow-none`}
        onChange={(e) => getReviews.handleSort(e.currentTarget.selectedIndex)} value={getReviews.sort.label}>
          <OrderByOptions options={orderReviews} />
        </select>
        {userContext?.email !== "" ?
        <div className="mt-4 h-[425px] overflow-y-scroll pr-5">
          <div className="flex flex-col gap-4">
            {getReviews.next.map((review, index) => {
              return (
                <Review 
                  review={review} 
                  key={index}
                  setNext={getReviews.setNext}
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
          <button className="secondary-btn h-[40px] cursor-pointer m-auto block mt-6 mb-5"
          onClick={getReviews.handlePage}>
            Read More Reviews
          </button>}
          {getReviews.errorMessage && <ErrorMessage error={getReviews.errorMessage.message} styles="!mt-0" />}
        </div> :
        <div className="absolute w-full h-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center justify-center
        backdrop-filter backdrop-blur-md bg-[#bbbbbb09] dark:bg-[#1c1c1ca6]">
          <p className="text-[19px] text-center font-semibold bg-opacity-70 p-2 rounded-[8px]">
            You must be logged in to see reviews of this product.
          </p>
        </div>}
      </div>
      <WriteReview 
        product={product}
        setNext={getReviews.setNext}
        sort={getReviews.sort}
        handleSort={getReviews.handleSort}
      />
    </div>
  )
};

export default Reviews;