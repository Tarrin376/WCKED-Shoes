import { TReview } from "../../@types/TReview";
import { useState } from "react";
import RatingStars from "../../components/RatingStars";
import axios from "axios";
import { convertDate } from "../../utils/convertDate";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import { TErrorMessage } from "../../@types/TErrorMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import { useWindowSize } from "../../hooks/useWindowSize";

interface Props {
  review: TReview,
}

const Review: React.FC<Props> = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(review.helpful_count);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const [hide, setHide] = useState<boolean>(false);
  const windowSize = useWindowSize();
  
  const addHelpfulCount = async (): Promise<TErrorMessage | undefined> => {
    try {
      const countResponse = await axios.put<string>(`${process.env.REACT_APP_API_URL}/api/reviews/${review.id}/helpful`);
      setHelpfulCount(parseInt(countResponse.data));
      review.is_marked = true;
      setDisabled(true);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const deleteReview = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.delete<string>(`${process.env.REACT_APP_API_URL}/api/reviews/${review.id}`);
      setHide(true);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const getReviewHelpfulText = () => {
    if (review.is_marked) {
      return helpfulCount === 1 ? "You found this review helpful" : `You and ${helpfulCount - 1} ${helpfulCount - 1 === 1 ? "other" : "others"} 
      found this review helpful`;
    } else {
      return `${helpfulCount === 1 ? 'One person' : `${helpfulCount} people`} found this review helpful`;
    }
  }

  if (hide) {
    return <></>
  }

  return (
    <div className="border-b border-b-light-border dark:border-b-main-gray-border pb-6">
      <div className="flex max-md:flex-col md:items-center md:gap-3">
        <h5 className="text-main-text-black dark:text-main-text-white font-semibold">{review.title}</h5>
        <p className="text-side-text-light dark:text-side-text-gray text-[15px]">{`Posted on ${convertDate(review.date_posted, true)}`}</p>
      </div>
      <div className={`flex items-center gap-[13px] mt-[6px] mb-2 max-sm:flex-col-reverse max-sm:items-start`}>
        <RatingStars rating={review.rating} border={review.verified_purchase && windowSize >= 480} />
        <div className={`flex ${windowSize <= 385 ? "flex-col items-start gap-[8px]" : "items-center gap-[13px]"}`}>
          {review.verified_purchase && <p className="popular">Verified Purchase</p>}
          {review.is_own_review && 
          <div className="flex items-center gap-[13px]">
            {windowSize > 385 && <div className="w-[1px] bg-light-border dark:bg-main-gray-border h-[17px]"></div>}
            <p className="popular bg-bg-primary-btn-hover">Your review</p>
          </div>}
          </div>
      </div>
      <p className="text-main-text-black dark:text-main-text-white">{review.review}</p>
      {helpfulCount > 0 && 
      <p className="text-side-text-light dark:text-side-text-gray mt-2 text-[15px]">
        {getReviewHelpfulText()}
      </p>} 
      <div className="gap-3 flex items-center">
        {(!review.is_marked && !disabled && !review.is_own_review) &&
        <Button
          action={addHelpfulCount}
          completedText="Marked as helpful"
          defaultText="Helpful"
          loadingText="Marking as helpful"
          styles="secondary-btn h-[30px] mt-3"
          setErrorMessage={setErrorMessage}
        />}
        {review.is_own_review &&
        <Button
          action={deleteReview}
          completedText="Review deleted"
          defaultText="Delete review"
          loadingText="Deleting review"
          styles="danger-btn h-[30px] mt-3"
          setErrorMessage={setErrorMessage}
        />}
      </div>
      {errorMessage && 
      <ErrorMessage 
        error={errorMessage.message} 
        styles="!mt-4" 
      />}
    </div>
  )
}

export default Review;