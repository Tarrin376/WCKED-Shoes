import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { TProductCard } from "../@types/TProductCard";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";

export const useGetRecommended = (URL: string): {
  products: TProductCard[] | undefined,
  errorMessage: TErrorMessage | undefined
} => {
  const [products, setProducts] = useState<TProductCard[]>();
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<TProductCard[]>(URL);
        setProducts(response.data);
      }
      catch (error: any) {
        const errorMsg = getAPIErrorMessage(error as AxiosError<{ error: string }>);
        setErrorMessage(errorMsg);
      }
    })()
  }, [URL]);

  return {
    products,
    errorMessage
  }
}
