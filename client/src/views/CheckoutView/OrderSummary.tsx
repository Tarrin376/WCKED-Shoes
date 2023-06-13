import CheckoutItemsLoading from "../../loading/CheckoutItemsLoading";
import CheckoutItem from "./CheckoutItem";
import CartPriceSummaryLoading from "../../loading/CartPriceSummaryLoading";
import CartPriceSummary from "../../components/CartPriceSummary";
import { TUseGetCart } from "../../@types/TUseGetCart";
import { TCartItem } from "../../@types/TCartItem";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import { TDiscount } from "../../@types/TDiscount";

interface Props {
  cartItems: TUseGetCart,
  notEnoughStockItems: number[],
  selectedMethod: TDeliveryMethod | undefined,
  discount: TDiscount
}

const OrderSummary: React.FC<Props> = ({ cartItems, notEnoughStockItems, selectedMethod, discount }) => {
  return (
    <div className="flex-grow flex flex-col">
      <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Order Summary</p>
      <div className="light-component dark:gray-component p-5 flex flex-col justify-between flex-grow">
        {cartItems.cart ? 
        <div className="max-h-[670px] overflow-y-scroll">
          {cartItems.cart.map((cartItem: TCartItem, index: number) => {
            return (
              <CheckoutItem
                key={index} 
                item={cartItem} 
                notEnoughStock={notEnoughStockItems.includes(cartItem.curSize.id)}
                isFirst={index === 0}
              />
            )
          })}
        </div> :
        <CheckoutItemsLoading />}
        {cartItems.cart ? 
        <CartPriceSummary 
          subtotal={cartItems.subtotal}
          shipping={selectedMethod ? selectedMethod.price : 0}
          discount={cartItems.subtotal * discount.percent_off}
          styles="pt-6"
        /> : 
        <CartPriceSummaryLoading />}
      </div>
    </div>
  )
};

export default OrderSummary;