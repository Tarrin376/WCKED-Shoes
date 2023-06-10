import { useEffect, useState } from "react";
import { TDeliveryMethod } from "../@types/TDeliveryMethod";
import axios, { AxiosError } from "axios";
import { TErrorMessage } from "../@types/TErrorMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

export const useDeliveryMethods = (): {
  methods: TDeliveryMethod[],
  errorMessage: TErrorMessage | undefined
} => {
  const [methods, setMethods] = useState<TDeliveryMethod[]>([]);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<TDeliveryMethod[]>("/delivery-methods");
        setMethods(response.data);
      }
      catch (error: any) {
        const err = error as AxiosError;
        if (err.response!.status === 429) {
          setErrorMessage(getAPIErrorMessage(err));
        } else {
          setErrorMessage({ message: "Unable to get delivery methods", status: 500 });
        }
      }
    })()
  }, []);

  return {
    methods,
    errorMessage
  }
}