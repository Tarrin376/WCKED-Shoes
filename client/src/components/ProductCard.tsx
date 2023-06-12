import { TProductCard } from "../@types/TProductCard";
import Rating from "./Rating";
import { getStockText } from "../utils/getStockText";
import { getCarbonFootprintColour } from "../utils/getCarbonFootprintColour";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TSize } from "../@types/TSize";
import { TCheckedItem } from "../@types/TCheckedItem";

interface Props {
  product: Readonly<TProductCard>,
  styles?: string,
  setTotalPrice?: React.Dispatch<React.SetStateAction<number>>,
  smallSize?: boolean,
  setCheckedItems?: React.Dispatch<React.SetStateAction<Readonly<TCheckedItem[]>>>,
  dropdown?: boolean,
}

export const popularSoldCount = 2;

const ProductCard: React.FC<Props> = ({ product, styles, setTotalPrice, smallSize, setCheckedItems, dropdown }) => {
  const navigate = useNavigate();
  const stockText = getStockText(product.stock);
  const carbonFootprintColour = getCarbonFootprintColour(product.carbon_footprint);
  const [checked, setChecked] = useState<boolean>(false);
  const [size, setSize] = useState<string>("");

  const goToProduct = () => {
    navigate(`/products/${product.id}`, { replace: true });
  }

  const toggleChecked = () => {
    if (!setTotalPrice || !setCheckedItems) {
      return;
    }

    if (checked) {
      setTotalPrice((cur) => cur - product.price);
      setChecked(false);
      setCheckedItems((cur) => cur.filter((item: TCheckedItem) => item.productId !== product.id || item.size !== size));
    } else {
      setTotalPrice((cur) => cur + product.price);
      setChecked(true);
      setCheckedItems((cur) => [...cur, { productId: product.id, size: size }]);
    }
  }

  const updateSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setCheckedItems) {
      const nextSize = e.target.value;
      setCheckedItems((cur) => {
        return (
          [...cur.filter((item: TCheckedItem) => item.productId !== product.id || item.size !== size), {
            productId: product.id, 
            size: nextSize
          }]
        )
      });
      setSize(nextSize);
    }
  }

  return (
    <div className={`dark:gray-component light-component !bg-transparent border-none !shadow-none 
    ${styles} ${smallSize ? "w-[200px]" : "w-[265px]"}`}>
      <div className={`w-full rounded-[8px] relative bg-center bg-cover border dark:border-search-border dark:shadow-none 
      shadow-light-component-shadow border-light-border ${smallSize ? "h-[200px]" : "h-[265px]"}`} 
      style={{backgroundImage: `url(${product.thumbnail})`}}>
        <Rating rating={product.rating} styles={"absolute right-2 top-2 !bg-no-reviews-bg"} />
        {product.num_sold >= popularSoldCount && !smallSize && <p className="popular absolute top-2 left-2">Popular</p>}
        {dropdown && product && 
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <input type="checkbox" checked={checked} onChange={toggleChecked} className="w-[15px] h-[15px]" />
          <select className={`popular bg-no-reviews-bg ${!checked ? "opacity-50" : ""}`} 
          onChange={updateSize} defaultValue={""}>
            <option value={""}>Select Size</option>
            {product.sizes.filter((size: TSize) => size.stock > 0).map((size: TSize, index: number) => {
              return (
                <option value={size.size} key={index}>
                  {size.size}
                </option>
              );
            })}
          </select>
        </div>}
        {dropdown === false && 
        <p className="popular text-main-text-white absolute bottom-2 right-2">
          Your Item
        </p>}
      </div>
      <div className="border-b border-light-border dark:border-main-gray-border pb-4">
        <h3 className={`mt-3 text-[18px] cursor-pointer hover:!text-bg-primary-btn-hover btn 
        text-ellipsis whitespace-nowrap overflow-hidden ${smallSize ? "text-[16px]" : ""}`}
        onClick={goToProduct}>
          {product.name}
        </h3>
        <div className={`flex ${smallSize ? "flex-col items-start mt-1 gap-[6px]" : "items-center justify-between mt-2"}`}>
          <p className="text-[15px] dark:text-side-text-gray text-side-text-light">Carbon footprint:</p>
          <p className={`popular ${carbonFootprintColour}`}>{`${product.carbon_footprint} kg CO2E`}</p>
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