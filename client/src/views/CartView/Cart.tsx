import { TCartItem } from "../../@types/TCartItem";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import useGetCart from "../../hooks/useGetCart";
import CartPriceSummary from "../../components/CartPriceSummary";
import CartLoading from "../../loading/CartLoading";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = useGetCart();
  const [disabled, setDisabled] = useState<boolean>(false);

  const goToCheckout = () => {
    navigate("/checkout");
    window.scrollTo(0, 0);
  }

  if (!cartItems.cart) {
    return <CartLoading />
  }

  return (
    <>
      <h1 className="text-2xl max-sm:text-[22px] text-main-text-black dark:text-main-text-white pb-5">
        {`You have ${cartItems.cart.length} ${cartItems.cart.length !== 1 ? "items" : "item"} in your bag`}
      </h1>
      <div className="overflow-y-scroll max-h-[600px]">
        {cartItems.cart.map((cartItem: TCartItem, index: number) => {
          return (
            <CartItem 
              key={index} 
              cartItem={cartItem} 
              setCart={cartItems.setCart} 
              disabled={disabled}
              setDisabled={setDisabled}
            />
          )
        })}
      </div>
      <CartPriceSummary subtotal={cartItems.subtotal} discount={0} styles="pt-6" />
      <button className={`btn-primary block mt-6 h-[45px] w-[180px] text-base mb-[70px] 
      ${cartItems.cart.length === 0 || cartItems.cart.some((cartItem: TCartItem) => cartItem.curSize.stock < cartItem.quantity || disabled) ? 
      "disabled-btn-light dark:disabled-btn" : ""}`} onClick={goToCheckout}>
        Go to checkout
      </button>
    </>
  )
};

export default Cart;