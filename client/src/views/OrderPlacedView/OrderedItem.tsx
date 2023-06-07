import { TOrderedItem } from "../../@types/TOrderedItem";
import { Link } from "react-router-dom";

interface Props {
  item: TOrderedItem,
  isFirst: boolean,
  noBorder: boolean,
  styles?: string
}

const OrderedItem: React.FC<Props> = ({ item, isFirst, noBorder, styles }) => {
  return (
    <div className={`lg:py-5 max-lg:py-2 ${styles} border-b border-b-light-border dark:border-b-main-gray-border flex lg:gap-7 
    max-lg:gap-2 items-center ${isFirst ? "!pt-0" : ""} ${noBorder ? "!pb-0 !border-none" : ""}`}>
      <div className="w-[120px] h-[120px] max-lg:hidden bg-cover bg-center rounded-[8px] border border-light-border dark:border-search-border" 
      style={{backgroundImage: `url(${item.thumbnail})`}}>
      </div>
      <div className="pt-2 pb-2">
        <Link to={`/products/${item.product_id}`}>
          <h2 className="text-main-text-black dark:text-main-text-white lg:text-[19px] 
          max-lg:text-[17px] hover:!text-bg-primary-btn-hover transition ease-in duration-150">
            {item.product_name}
          </h2>
        </Link>
        <p className="text-side-text-light dark:text-side-text-gray mt-[2px]">
          Size:
          <span className="text-main-text-black dark:text-main-text-white ml-2">{item.size}</span>
        </p>
        <p className="text-side-text-light dark:text-side-text-gray mt-[2px] md:hidden">
          Qty:
          <span className="text-main-text-black dark:text-main-text-white ml-2">{item.quantity}</span>
        </p>
      </div>
      <div className="flex items-center justify-end lg:gap-[150px] max-lg:gap-[70px] flex-grow">
        <p className="text-side-text-light dark:text-side-text-gray text-[17px] max-md:hidden">
          Qty.
          <span className="text-main-text-black dark:text-main-text-white ml-2">{item.quantity}</span>
        </p>
        <p className="text-main-text-black dark:text-main-text-white text-[17px] font-semibold">
          £{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  )
};

export default OrderedItem;