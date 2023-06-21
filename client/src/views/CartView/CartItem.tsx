import { TCartItem } from "../../@types/TCartItem";
import { TUser } from "../../@types/TUser";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { TErrorMessage } from "../../@types/TErrorMessage";
import { useWindowSize } from "../../hooks/useWindowSize";

interface Props {
  cartItem: TCartItem,
  setCart: React.Dispatch<React.SetStateAction<TCartItem[] | undefined>>,
  disabled: boolean,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export const quantityLimit = 10;

const CartItem: React.FC<Props> = ({ cartItem, setCart, disabled, setDisabled }) => {
  const removeURL = `/api/users/cart/${cartItem.product_id}/${cartItem.curSize.size}/${-cartItem.quantity}`;
  const updateURL = `/api/users/cart/${cartItem.product_id}/${cartItem.curSize.size}/`;
  const [errorMessage, setErrorMessage] = useState<TErrorMessage | undefined>();
  const windowSize = useWindowSize();

  const removeFromCart = async () => {
    try {
      setDisabled(true);
      const removeResponse = await axios.delete<{user_data: TUser, cart: TCartItem[]}>(removeURL);
      setCart(removeResponse.data.cart);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      setErrorMessage(errorMsg);
    }
    finally {
      setDisabled(false);
    }
  }

  const updateQuantity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setDisabled(true);
      const change = parseInt(e.target.value) - cartItem.quantity;
      const updateResponse = await axios.put<{ user_data: TUser, cart: TCartItem[], valid: boolean }>(updateURL + change);
      setCart(updateResponse.data.cart);
      setErrorMessage(undefined);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      setErrorMessage(errorMsg);
    }
    finally {
      setDisabled(false);
    }
  }

  const getQuantityExceededMessage = () => {
    if (cartItem.curSize.stock > 1) return `Sorry, there are only ${cartItem.curSize.stock} available in this size.`;
    else if (cartItem.curSize.stock === 1) return `Sorry, there is only ${cartItem.curSize.stock} available in this size.`;
    else return 'Sorry, this item is now out of stock';
  }

  return (
    <div className="py-5 border-b border-b-light-border dark:border-b-main-gray-border flex gap-7 items-center">
      <div className="w-[160px] h-[160px] max-md:hidden bg-cover bg-center rounded-[8px] border border-light-border dark:border-search-border" 
      style={{backgroundImage: `url(${cartItem.thumbnail})`}}>
      </div>
      <div className="flex-grow">
        <Link to={`/products/${cartItem.product_id}`}>
          <h2 className="text-main-text-black dark:text-main-text-white text-[21px] 
          cursor-pointer hover:!text-bg-primary-btn-hover btn max-sm:text-[19px] w-fit">
            {cartItem.product_name}
          </h2>
        </Link>
        <p className="text-side-text-light dark:text-side-text-gray mt-[2px]">
          Total: 
          <span className="text-main-text-black dark:text-main-text-white">{` £${(cartItem.price * cartItem.quantity).toFixed(2)}`}</span>
        </p>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="light-component dark:gray-component !rounded-md px-2 h-[30px] flex items-center justify-center">
              <p className="text-main-text-black dark:text-main-text-white">
                {cartItem.curSize.size}
              </p>
            </div>
            {cartItem.curSize.stock > 0 &&
            <select className={`light-component dark:gray-component !rounded-md px-2 h-[30px] cursor-pointer text-main-white
            ${disabled ? "disabled-btn-light dark:disabled-btn" : ""}`}
            onChange={updateQuantity} defaultValue={cartItem.quantity}>
              {new Array(quantityLimit).fill(0).map((_, index) => {
                return (
                  <option key={index} value={index + 1}>
                    {`Qty: ${index + 1}`}
                  </option>
                );
              })}
            </select>}
          </div>
          {windowSize > 360 && 
          <button className={`secondary-btn h-[30px] mr-5 ${disabled ? "disabled-btn-light dark:disabled-btn" : ""}`} 
          onClick={removeFromCart}>
            Remove
          </button>}
        </div>
        {windowSize <= 360 && 
        <button className={`secondary-btn mt-[14px] h-[30px] mr-5 ${disabled ? "disabled-btn-light dark:disabled-btn" : ""}`} 
        onClick={removeFromCart}>
          Remove
        </button>}
        {(errorMessage || cartItem.curSize.stock < cartItem.quantity) && 
        <ErrorMessage 
          error={!errorMessage ? getQuantityExceededMessage() : errorMessage.message} 
          styles={"py-1 text-[15px] mt-[14px] mr-5"} 
        />}
      </div>
    </div>
  )
};

export default CartItem;
