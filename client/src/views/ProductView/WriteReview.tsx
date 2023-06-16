import RatingStars from "../../components/RatingStars";
import { useState } from "react";
import { TProduct } from "../../@types/TProduct";
import axios, { AxiosError } from "axios";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { TErrorMessage } from "../../@types/TErrorMessage";
import { TReview } from "../../@types/TReview";
import { TOrderByOption } from "../../@types/TOrderByOption";
import { TReviewOptions } from "../../@types/TReviewOptions";
import { orderReviews } from "../../utils/orderReviews";

interface Props {
  product: Readonly<TProduct>,
  setNext: React.Dispatch<React.SetStateAction<TReview[]>>,
  sort: TOrderByOption<TReviewOptions>,
  handleSort: (optionIndex: number) => void
}

const defaultText = "Submit review";
const loadingText = "Submitting review...";
const completedText = "Review submitted";
const minReviewLength = 100;
const maxReviewLength = 400;

const WriteReview: React.FC<Props> = ({ product, setNext, sort, handleSort }) => {
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const updateReviewTitle = (title: string) => {
    setReviewTitle(title);
  }

  const updateReview = (review: string) => {
    setReview(review);
  }

  const submitReview = async (): Promise<TErrorMessage | undefined> => {
    if (!product) {
      return { message: "Product not found", status: 400 };
    }

    if (reviewTitle.trim().length === 0) {
      return { message: "Review heading must be specified", status: 400 };
    } else if (review.trim().length < minReviewLength) {
      return { message: "Review must be at least " + minReviewLength + " characters long", status: 400 };
    } else if (review.trim().length > maxReviewLength) {
      return { message: "Review cannot be more than " + maxReviewLength + " characters long", status: 400 };
    }

    try {
      const newReview = await axios.post<TReview>(`/api/reviews/${product.id}`, {
        rating: rating,
        title: reviewTitle,
        review: review,
      });
      
      setRating(5);
      setReviewTitle("");
      setReview("");
      
      if (sort === orderReviews[0]) {
        setNext((cur: TReview[]) => [newReview.data, ...cur]);
      } else {
        handleSort(0);
      }
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  return (
    <div className="light-component dark:gray-component 2xl:w-[35%] max-2xl:w-[40%] max-xl:w-full p-5 pt-3 relative">
      <h4 className="text-[19px] mb-3 font-semibold">Write a review</h4>
      <p className="text-side-text-light dark:text-side-text-gray mb-4">Rating</p>
      <RatingStars rating={rating} setRating={setRating} />
      <p className="text-side-text-light dark:text-side-text-gray mt-4 mb-4">Heading</p>
      <input type="text" className="text-box-light dark:text-box w-full mb-4" maxLength={40} placeholder="Enter review heading" value={reviewTitle}
      onChange={(e) => updateReviewTitle(e.target.value)} />
      <p className="text-side-text-light dark:text-side-text-gray mb-4">{`Review of the product (must be between ${minReviewLength} and ${maxReviewLength} characters)`}</p>
      <textarea className="text-box-light dark:text-box w-full h-[250px]" placeholder="Share your thoughts on the product" value={review}
      onChange={(e) => updateReview(e.target.value)} maxLength={400} />
      {errorMessage && 
      <ErrorMessage
        error={errorMessage.message} 
        styles="absolute top-0 left-0 w-full !mt-0 rounded-b-[0px]"
      />}
      <Button 
        action={submitReview} 
        completedText={completedText}
        defaultText={defaultText} 
        loadingText={loadingText}
        styles={`btn-primary px-3 h-[40px] ml-auto block mt-6`}
        setErrorMessage={setErrorMessage}
      />
    </div>
  )
};

export default WriteReview;
