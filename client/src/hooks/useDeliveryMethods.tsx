import { useEffect, useState } from "react";
import { TDeliveryMethod } from "../@types/TDeliveryMethod";
import axios, { AxiosError } from "axios";

export const useDeliveryMethods = () => {
  const [deliveryMethods, setDeliveryMethods] = useState<TDeliveryMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<TDeliveryMethod | null>(deliveryMethods.length === 0 ? null : deliveryMethods[0]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<TDeliveryMethod[]>("/delivery-methods");
        setDeliveryMethods(response.data);
        setSelectedMethod(response.data[0]);
      }
      catch (error: any) {
        console.log(error);
      }
    })()
  }, []);

  return {
    deliveryMethods,
    selectedMethod,
    setSelectedMethod
  }
}