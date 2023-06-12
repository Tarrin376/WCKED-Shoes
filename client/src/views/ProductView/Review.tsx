import { TReview } from "../../@types/TReview";
import { useState } from "react";
import RatingStars from "../../components/RatingStars";
import axios from "axios";
import { convertDate } from "../../utils/convertDate";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import { TErrorMessage } from "../../@types/TErrorMessage";
import ErrorMessage from "../../components/ErrorMessage";

interface Props {
  review: Readonly<TReview>,
  setNext: React.Dispatch<React.SetStateAction<TReview[]>>
}

const Review: React.FC<Props> = ({ review, setNext }) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(review.helpful_count);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  
  const addHelpfulCount = async () => {
    try {
      const countResponse = await axios.put<string>(`/reviews/${review.id}/helpful`);
      setHelpfulCount(parseInt(countResponse.data));
      setDisabled(true);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      setErrorMessage(errorMsg);
    }
  }

  const deleteReview = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.delete<string>(`/reviews/${review.id}`);
      setNext((cur: TReview[]) => cur.filter((curReview: TReview) => curReview.id !== review.id));
      return undefined;
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
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
        {review.verified_purchase && <p className="popular">Verified Purchase</p>}
        {review.is_own_review && 
        <div className="flex items-center gap-[13px]">
          <div className="w-[1px] bg-light-border dark:bg-main-gray-border h-[17px]"></div>
          <p className="popular bg-bg-primary-btn-hover">Your review</p>
        </div>}
      </div>
      <p className="text-main-text-black dark:text-main-text-white">{review.review}</p>
      {helpfulCount > 0 && 
      <p className="text-side-text-light dark:text-side-text-gray mt-2 text-[15px]">
        {`${helpfulCount === 1 ? 'One person' : `${helpfulCount} people`} found this review helpful`}
      </p>} 
      <div className="gap-3 flex items-center">
        {(!review.is_marked && !disabled && !review.is_own_review) &&
        <button className="secondary-btn h-[30px] mt-3" onClick={addHelpfulCount}>
          Helpful
        </button>}
        {review.is_own_review &&
        <button className="danger-btn h-[30px] mt-3" onClick={deleteReview}>
          Delete review
        </button>}
      </div>
      {errorMessage && <ErrorMessage error={errorMessage.message} styles={"!mt-4"} />}
    </div>
  )
}

export default Review;