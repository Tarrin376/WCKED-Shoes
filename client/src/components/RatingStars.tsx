import ReviewStar1 from "../assets/review-star1.png";
import ReviewStar2 from "../assets/review-star2.png";
import ReviewStar3 from "../assets/review-star3.png";
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";

interface RatingStarsProps {
  rating: number,
  setRating?: React.Dispatch<React.SetStateAction<number>>
}

interface StarsProps extends RatingStarsProps {
  src: string,
  start: number
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, setRating }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <div className="flex gap-1 mt-1 mb-2">
      <Stars rating={rating} src={ReviewStar1} setRating={setRating} start={1} />
      <Stars rating={5 - rating} src={themeContext?.darkMode ? ReviewStar2 : ReviewStar3} setRating={setRating} start={rating + 1} />
    </div>
  )
};

const Stars: React.FC<StarsProps> = ({ rating, src, setRating, start }) => {
  const updateRating = (newRating: number) => {
    if (setRating) {
      setRating(newRating);
    }
  }

  return (
    <>
      {new Array(rating).fill(0).map((_, i) => {
        return (
          <img 
            src={src} 
            onClick={() => updateRating(i + start)} 
            key={i} 
            alt="stars" 
            className={`w-[17px] h-[17px] block ${setRating ? "cursor-pointer" : ""}`} />
        )
      })}
    </>
  )
}

export default RatingStars;