import MastercardIcon from "../assets/mastercard.png";
import VisaIcon from "../assets/visa-card.png";
import DiscoverIcon from "../assets/discover-card.png";

const images = [MastercardIcon, VisaIcon, DiscoverIcon];

interface Props {
  styles?: string
}

const CardImages: React.FC<Props> = ({ styles }) => {
  return (
    <div className="flex items-center gap-1">
      {images.map((image, index) => {
        return (
          <img src={image} key={index} className={styles} alt={image} />
        )
      })}
    </div>
  )
};

export default CardImages;
