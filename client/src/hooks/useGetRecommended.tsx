import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { TProductCard } from "../@types/TProductCard";

export const useGetRecommended = (URL: string) => {
  const [products, setProducts] = useState<TProductCard[]>(); 

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        try {
          const response = await axios.get<TProductCard[]>(URL);
          setProducts(response.data);
        }
        catch (error: any) {
          console.log(error);
        }
      })()
    }, 3000)
  }, [URL]);

  return products;
}
