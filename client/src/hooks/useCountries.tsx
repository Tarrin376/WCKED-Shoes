import { useState, useEffect } from "react";
import axios from "axios";
import { TCountry } from "../@types/TCountry";

const useCountries = () => {
  const endpoint = 'https://restcountries.com/v3.1/all?fields=name,flag';
  const [countries, setCountries] = useState<TCountry[] | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const countriesResponse = await axios.get<TCountry[]>(endpoint);
        setCountries(countriesResponse.data);
      }
      catch (error) {
        console.log(error);
      }
    })()
  }, []);

  return countries;
};

export default useCountries;