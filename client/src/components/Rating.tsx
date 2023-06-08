import StarIcon from "../assets/star.png";
import { getRatingColour } from "../utils/getRatingColour";

interface Props {
  rating: number,
  styles?: string,
}

const Rating: React.FC<Props> = ({ rating, styles }) => {
  return (
    <div className={`text-main-text-white ${getRatingColour(rating)} w-fit rounded-md 
    h-[22px] px-3 flex items-center pb-[1px] gap-[7px] ${styles}`}>
      <p className="text-sm">{rating === 0 ? "No reviews" : Math.round((rating + Number.EPSILON) * 10) / 10}</p>
      <img src={StarIcon} alt="stars" className="w-[14px] h-[14px]" />
    </div>
  )
};

export default Rating;