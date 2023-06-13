import { TCartItem } from "../../@types/TCartItem";

interface Props {
  item: TCartItem,
  notEnoughStock: boolean,
  isFirst: boolean,
}

export const CheckoutItem: React.FC<Props> = ({ item, notEnoughStock, isFirst }) => {
  return (
    <div className={`pb-5 ${isFirst ? "" : "pt-5"} border-b border-b-light-border dark:border-b-main-gray-border 
    flex gap-7 items-center`}>
      <div item-quantity={item.quantity} 
      className="w-[110px] h-[110px] max-md:hidden bg-cover bg-center rounded-[8px] border border-light-border dark:border-search-border"
      style={{backgroundImage: `url(${item.thumbnail})`}}>
      </div>
      <div className="flex-grow">
        <h2 className="text-main-text-black dark:text-main-text-white text-[18px] text-ellipsis whitespace-nowrap overflow-hidden max-w-[350px]">{item.product_name}</h2>
        <p className="text-side-text-light dark:text-side-text-gray mt-[3px]">Size: 
          <span className="ml-2 text-main-text-black dark:text-main-text-white">
            {item.curSize.size}
          </span>
        </p>
        <p className="text-side-text-light dark:text-side-text-gray mt-[3px]">
          Total:
          <span className="text-main-text-black dark:text-main-text-white ml-2">
            {`£${(item.price * item.quantity).toFixed(2)}`}
          </span>
        </p>
        <p className="text-side-text-light dark:text-side-text-gray mt-[3px]">
          Quantity:
          {notEnoughStock ? 
          <span className="text-side-text-red ml-2">
            Not enough stock
          </span> : 
          <span className="text-main-text-black dark:text-main-text-white ml-2">
            {item.quantity}
          </span>}
        </p>
      </div>
    </div>
  );
};

export default CheckoutItem;