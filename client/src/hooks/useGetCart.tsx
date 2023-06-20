import { TCartItem } from "../@types/TCartItem";
import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { TUseGetCart } from "../@types/TUseGetCart";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";
import { useNavigateErrorPage } from "./useNavigateErrorPage";

const useGetCart = (): TUseGetCart => {
  const [cart, setCart] = useState<TCartItem[]>();
  const subtotal = cart ? cart.reduce((sum, cartItem: TCartItem) => sum + cartItem.price * cartItem.quantity, 0) : 0;
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  
  useNavigateErrorPage(errorMessage);

  useEffect(() => {
    (async () => {
      try {
        const cartResponse = await axios.get<TCartItem[]>(`${process.env.REACT_APP_API_URL}/api/users/cart`, { withCredentials: true });
        setCart(cartResponse.data);
      }
      catch (error: any) {
        const errorMsg = getAPIErrorMessage(error as AxiosError);
        setErrorMessage(errorMsg);
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
