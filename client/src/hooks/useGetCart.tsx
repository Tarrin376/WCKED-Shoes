import { TCartItem } from "../@types/TCartItem";
import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { defaultUserData } from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";

const useGetCart = (): {
  subtotal: number,
  cart: TCartItem[] | undefined,
  setCart: React.Dispatch<React.SetStateAction<TCartItem[] | undefined>>
} => {
  const [cart, setCart] = useState<TCartItem[]>();
  const subtotal = cart ? cart.reduce((sum, cartItem: TCartItem) => sum + cartItem.price * cartItem.quantity, 0) : 0;
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const cartResponse = await axios.get<TCartItem[]>("/users/cart");
        setCart(cartResponse.data);
      }
      catch (error: any) {
        if (error instanceof AxiosError) {
          if (error.response!.status === 401) {
            userContext?.setUserData(defaultUserData);
            navigate("/");
          }
        }
      }
    })()
  }, [setCart, navigate, userContext]);

  return { 
    subtotal,
    cart,
    setCart
  };
};

export default useGetCart;
