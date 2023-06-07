import useCountries from "../hooks/useCountries";
import { TCountry } from "../@types/TCountry";

interface Props {
  selectedCountry: string;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
}

const CountryDropdown: React.FC<Props> = ({ selectedCountry, setSelectedCountry }) => {
  const countries: TCountry[] | undefined = useCountries();

  const updateCountry = (country: string) => {
    setSelectedCountry(country);
  }

  return (
    <select className="block h-[42px] text-box-light dark:text-box shadow-none w-full cursor-pointer" name="country/region"
    onChange={(e) => updateCountry(e.target.value)}>
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