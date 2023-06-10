import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { TCountry } from "../@types/TCountry";
import { TErrorMessage } from "../@types/TErrorMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";

const useCountries = (): {
  allCountries: TCountry[] | undefined,
  errorMessage: TErrorMessage | undefined
} => {
  const endpoint = 'https://restcountries.com/v3.1/all?fields=name,flag';
  const [countries, setCountries] = useState<TCountry[] | undefined>();
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  useEffect(() => {
    (async () => {
      try {
        const countriesResponse = await axios.get<TCountry[]>(endpoint);
        setCountries(countriesResponse.data);
      }
      catch (error: any) {
        const err = error as AxiosError;
        if (err.response!.status === 429) {
          setErrorMessage(getAPIErrorMessage(err));
        } else {
          setErrorMessage({ message: "Unable to get countries", status: 500 });
        }
      }
    })()
  }, []);

  return { allCountries: countries, errorMessage };
};

export default useCountries;