import { TProductCard } from "../@types/TProductCard";
import Rating from "./Rating";
import { getStockText } from "../utils/getStockText";
import { getCarbonFootprintColour } from "../utils/getCarbonFootprintColour";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Readonly<TProductCard>,
  styles?: string
}

export const popularSoldCount = 2;

const ProductCard: React.FC<Props> = ({ product, styles }) => {
  const navigate = useNavigate();
  const stockText = getStockText(product.stock);
  const carbonFootprintColour = getCarbonFootprintColour(product.carbon_footprint);

  const goToProduct = () => {
    navigate(`/products/${product.id}`);
  }

  return (
    <div className={`dark:gray-component light-component !bg-transparent border-none !shadow-none p-0 w-[265px] h-fit ${styles}`}>
      <div className="w-full h-[265px] rounded-[8px] relative bg-center bg-cover border dark:border-search-border dark:shadow-none 
      shadow-light-component-shadow border-light-border" style={{backgroundImage: `url(${product.thumbnail})`}}>
        <Rating rating={product.rating} styles={"absolute right-2 top-2 !bg-no-reviews-bg"} />
        {product.num_sold >= popularSoldCount && <p className="best-seller absolute top-2 left-2">Best Seller</p>}
      </div>
      <div className="border-b border-light-border dark:border-[#6f6f6f63] pb-4">
        <h3 className="mt-3 text-[18px] cursor-pointer transition ease-in duration-150 hover:text-bg-primary-btn-hover text-ellipsis whitespace-nowrap overflow-hidden"
        onClick={goToProduct}>
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] dark:text-side-text-gray text-side-text-light">Carbon footprint</p>
          <p className={`best-seller ${carbonFootprintColour}`}>{`${product.carbon_footprint} kg CO2E`}</p>
        </div>
      </div>
      <div className="mt-1 flex justify-between items-center h-[37px]">
        <p className="text-[19px]">£{product.price}</p>
        <p className={stockText.color}>{stockText.message}</p>
      </div>
    </div>
  )
};

export default ProductCard;