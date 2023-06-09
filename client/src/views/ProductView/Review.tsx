import { TReview } from "../../@types/TReview";
import { useState } from "react";
import RatingStars from "../../components/RatingStars";
import axios, { AxiosError } from "axios";
import { convertDate } from "../../utils/convertDate";
import Button from "../../components/Button";

interface Props {
  review: Readonly<TReview>;
  resetState: () => void
}

const Review: React.FC<Props> = ({ review, resetState }) => {
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

  const deleteReview = async (): Promise<boolean> => {
    try {
      await axios.delete<string>(`/reviews/${review.id}`);
      resetState();
      return true;
    }
    catch (error: any) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="border-b border-b-light-border dark:border-b-main-gray-border pb-6">
      <div className="flex max-md:flex-col md:items-center md:gap-4">
        <h5 className="text-main-text-black dark:text-main-text-white font-semibold">{review.title}</h5>
        <p className="text-side-text-light dark:text-side-text-gray text-[15px]">{`Posted on ${convertDate(review.date_posted, true)}`}</p>
      </div>
      <div className="flex items-center gap-[13px] mt-[6px] mb-2">
        <RatingStars rating={review.rating} border={review.verified_purchase} />
        {review.verified_purchase && <p className="popular pt-[1px]">Verified Purchase</p>}
        {review.is_own_review && 
        <div className="flex items-center gap-[13px]">
          <div className="w-[1px] bg-light-border dark:bg-main-gray-border h-[17px]"></div>
          <p className="popular bg-bg-primary-btn-hover pt-[1px]">Your review</p>
        </div>}
      </div>
      <p className="text-main-text-black dark:text-main-text-white">{review.review}</p>
      {helpfulCount > 0 && 
      <p className="text-side-text-light dark:text-side-text-gray mt-2 text-[15px]">
        {`${helpfulCount === 1 ? 'One person' : `${helpfulCount} people`} found this review helpful`}
      </p>} 
      <div className="gap-3 flex items-center">
        {(!review.is_marked && disabled && !review.is_own_review) &&
        <button className="secondary-btn h-[30px] w-[80px] mt-3 " onClick={addHelpfulCount}>
          Helpful
        </button>}
        {review.is_own_review &&
        <button className="danger-btn w-fit h-[30px] mt-3" onClick={deleteReview}>
          Delete Review
        </button>}
      </div>
    </div>
  )
}

export default Review;