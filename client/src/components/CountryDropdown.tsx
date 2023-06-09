import useCountries from "../hooks/useCountries";
import { TCountry } from "../@types/TCountry";
import { useEffect, useRef } from "react";

interface Props {
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
}

const CountryDropdown: React.FC<Props> = ({ selectedCountry, setSelectedCountry }) => {
  const countries: TCountry[] | undefined = useCountries();
  const selectRef = useRef<HTMLSelectElement>(null);

  const updateCountry = (country: string) => {
    setSelectedCountry(country);
  }

  useEffect(() => {
    if (selectRef.current && ![...selectRef.current.options].find((option) => option.value === selectedCountry)) {
      setSelectedCountry("United Kingdom 🇬🇧");
    }
  }, [selectedCountry, setSelectedCountry])

  return (
    <select className="block h-[42px] text-box-light dark:text-box shadow-none w-full cursor-pointer" name="country/region"
    onChange={(e) => updateCountry(e.target.value)} ref={selectRef}>
      {countries && countries.map((country: TCountry) => {
        return (
          <option key={country.name.common} value={`${country.name.common} ${country.flag}`} 
          selected={`${country.name.common} ${country.flag}` === selectedCountry}>
            {country.flag} {country.name.common}
          </option>
        )
      })}
    </select>
  )
};

export default CountryDropdown;