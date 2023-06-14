import { TCartItem } from "../@types/TCartItem";
import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { TUseGetCart } from "../@types/TUseGetCart";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

const useGetCart = (): TUseGetCart => {
  const [cart, setCart] = useState<TCartItem[]>();
  const subtotal = cart ? cart.reduce((sum, cartItem: TCartItem) => sum + cartItem.price * cartItem.quantity, 0) : 0;
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        try {
          const cartResponse = await axios.get<TCartItem[]>("/api/users/cart");
          setCart(cartResponse.data);
        }
        catch (error: any) {
          const errorMsg = getAPIErrorMessage(error as AxiosError);
          if (!userContext?.email) {
            navigate("/");
          } else {
            navigate("/error", { state: { error: errorMsg.message } });
          }
        }
      })()
    }, 700)
    
  }, [setCart, navigate, userContext]);

  return { 
    subtotal,
    cart,
    setCart
  };
};

export default useGetCart;
