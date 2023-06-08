import { TCartItem } from "../../@types/TCartItem";
import { TUser } from "../../@types/TUser";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";

interface Props {
  cartItem: TCartItem,
  setCart: React.Dispatch<React.SetStateAction<TCartItem[] | undefined>>
}

export const quantityLimit = 10;

const CartItem: React.FC<Props> = ({ cartItem, setCart }) => {
  const [changingQuantity, setChangingQuantity] = useState(false);
  const removeURL = `/users/cart/${cartItem.product_id}/${cartItem.curSize.size}/${-cartItem.quantity}`;
  const [errorMessage, setErrorMessage] = useState("");

  const removeFromCart = async () => {
    try {
      const removeResponse = await axios.delete<{user_data: TUser, cart: TCartItem[]}>(removeURL);
      setCart(removeResponse.data.cart);
    }
    catch (err: any) {
      console.log(err);
    }
  }

  const updateQuantity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setChangingQuantity(true);
      const change = parseInt(e.target.value) - cartItem.quantity;
      const updateResponse = await axios.put<{user_data: TUser, cart: TCartItem[]}>(`/users/cart/${cartItem.product_id}/${cartItem.curSize.size}/${change}`);
      setCart(updateResponse.data.cart);
      setErrorMessage("");
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setCart(error.response!.data.cart);
      } else {
        setErrorMessage("Something went wrong.")
      }
    }
    finally {
      setChangingQuantity(false);
    }
  }

  return (
    <div className="py-5 border-b border-b-light-border dark:border-b-main-gray-border flex gap-7 items-center">
      <div className="w-[160px] h-[160px] max-md:hidden bg-cover bg-center rounded-[8px] border border-light-border dark:border-search-border" 
      style={{backgroundImage: `url(${cartItem.thumbnail})`}}>
      </div>
      <div className="flex-grow pt-1 pb-3">
        <Link to={`/products/${cartItem.product_id}`}>
          <h2 className="text-main-text-black dark:text-main-text-white text-[21px] 
          cursor-pointer hover:!text-side-text-blue btn max-sm:text-[19px] w-fit">
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
            <select className="light-component dark:gray-component !rounded-md px-2 h-[30px] cursor-pointer text-main-white" 
            disabled={changingQuantity} onChange={updateQuantity} defaultValue={cartItem.quantity}>
              {new Array(quantityLimit).fill(0).map((_, index) => {
                return (
                  <option key={index} value={index + 1}>
                    {`Qty: ${index + 1}`}
                  </option>
                );
              })}
            </select>}
          </div>
          <button className="secondary-btn w-[80px] h-[30px]" onClick={removeFromCart}>
            Remove
          </button>
        </div>
        {(errorMessage !== "" || cartItem.curSize.stock < cartItem.quantity) && 
        <ErrorMessage 
          error={errorMessage === "" ? 
          cartItem.curSize.stock > 0 ? 
          `Only ${cartItem.curSize.stock} available` 
          : "Out of stock" 
          : errorMessage} 
          styles={"py-1 text-[15px] mt-[14px]"} 
        />}
      </div>
    </div>
  )
};

export default CartItem;
