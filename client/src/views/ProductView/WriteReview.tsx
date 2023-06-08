import RatingStars from "../../components/RatingStars";
import { useState } from "react";
import { TProduct } from "../../@types/TProduct";
import axios, { AxiosError } from "axios";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";

interface Props {
  product: Readonly<TProduct>
}

const defaultText = "Submit review";
const loadingText = "Submitting review...";
const completedText = "Review submitted";
const minReviewLength = 100;
const maxReviewLength = 400;

const WriteReview: React.FC<Props> = ({ product }) => {
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const updateReviewTitle = (title: string) => {
    setReviewTitle(title);
  }

  const updateReview = (review: string) => {
    setReview(review);
  }

  const submitReview = async (): Promise<boolean> => {
    if (!product) {
      return true;
    }

    if (reviewTitle.trim().length === 0) {
      setErrorMessage("Review heading must be specified");
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    } else if (review.trim().length < minReviewLength) {
      setErrorMessage("Review must be at least " + minReviewLength + " characters long");
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    } else if (review.trim().length > maxReviewLength) {
      setErrorMessage("Review cannot be more than " + maxReviewLength + " characters long");
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    }

    try {
      await axios.post(`/reviews/${product.id}`, {
        rating: rating,
        title: reviewTitle,
        review: review
      });
      
      setRating(1);
      setReviewTitle("");
      setReview("");
      return true;
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error!.response!.data);
        setTimeout(() => setErrorMessage(""), 5000);
      }

      return false;
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
      onChange={(e) => updateReview(e.target.value)} />
      {errorMessage.length > 0 && 
      <ErrorMessage
        error={errorMessage} 
        styles="absolute top-0 left-0 w-full !mt-0 rounded-b-[0px]"
      />}
      <Button 
        action={submitReview} 
        completedText={completedText}
        defaultText={defaultText} 
        loadingText={loadingText}
        styles={`btn-primary px-3 h-[40px] ml-auto block mt-6`}
      />
    </div>
  )
};

export default WriteReview;
