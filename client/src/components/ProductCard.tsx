import { TProductCard } from "../@types/TProductCard";
import Rating from "./Rating";
import { getStockText } from "../utils/getStockText";
import { getCarbonFootprintColour } from "../utils/getCarbonFootprintColour";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  product: Readonly<TProductCard>,
  styles?: string,
  checkbox?: boolean,
  setTotalPrice?: React.Dispatch<React.SetStateAction<number>>,
  smallSize?: boolean,
  setCheckedItems?: React.Dispatch<React.SetStateAction<TProductCard[]>>
}

export const popularSoldCount = 2;

const ProductCard: React.FC<Props> = ({ product, styles, checkbox, setTotalPrice, smallSize, setCheckedItems }) => {
  const navigate = useNavigate();
  const stockText = getStockText(product.stock);
  const carbonFootprintColour = getCarbonFootprintColour(product.carbon_footprint);
  const [checked, setChecked] = useState<boolean>(true);

  const goToProduct = () => {
    navigate(`/products/${product.id}`);
  }

  const toggleChecked = () => {
    if (!setTotalPrice || !setCheckedItems) {
      return;
    }

    if (checked) {
      setTotalPrice((cur) => cur - product.price);
      setChecked(false);
      setCheckedItems((cur) => cur.filter((curProd: TProductCard) => curProd.id !== product.id));
    } else {
      setTotalPrice((cur) => cur + product.price);
      setChecked(true);
      setCheckedItems((cur) => [...cur, product]);
    }
  }

  return (
    <div className={`dark:gray-component light-component !bg-transparent border-none !shadow-none p-0 h-fit ${styles}
    ${smallSize ? "w-[220px]" : "w-[265px]"}`}>
      <div className={`w-full rounded-[8px] relative bg-center bg-cover border dark:border-search-border dark:shadow-none 
      shadow-light-component-shadow border-light-border ${smallSize ? "h-[220px]" : "h-[265px]"}`} 
      style={{backgroundImage: `url(${product.thumbnail})`}}>
        <Rating rating={product.rating} styles={"absolute right-2 top-2 !bg-no-reviews-bg"} />
        {product.num_sold >= popularSoldCount && !smallSize && <p className="best-seller absolute top-2 left-2">Best Seller</p>}
        {checkbox && <input type="checkbox" checked={checked} onChange={toggleChecked} className="absolute bottom-2 right-2 w-[17px] h-[17px]" />}
      </div>
      <div className="border-b border-light-border dark:border-[#6f6f6f63] pb-4">
        <h3 className={`mt-3 text-[18px] cursor-pointer transition ease-in duration-150 
        hover:text-bg-primary-btn-hover text-ellipsis whitespace-nowrap overflow-hidden ${smallSize ? "text-[16px]" : ""}
        ${!checked ? "line-through text-side-text-light dark:text-side-text-gray" : ""}`}
        onClick={goToProduct}>
          {product.name}
        </h3>
        <div className={`flex ${smallSize ? "flex-col items-start mt-1 gap-[6px]" : "items-center justify-between mt-2"}`}>
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