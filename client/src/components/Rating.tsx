import StarIcon from "../assets/star.png";
import { getRatingColour } from "../utils/getRatingColour";

interface Props {
  rating: number,
  styles?: string,
}

const Rating: React.FC<Props> = ({ rating, styles }) => {
  return (
    <div className={`${getRatingColour(rating)} popular flex items-center gap-[7px] ${styles}`}>
      <p className="text-sm">{rating === 0 ? "No reviews" : Math.round((rating + Number.EPSILON) * 10) / 10}</p>
      <img src={StarIcon} alt="stars" className="w-[14px] h-[14px]" />
    </div>
  )
};

export default Rating;