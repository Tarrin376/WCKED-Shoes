import CountryDropdown from "../../components/CountryDropdown";
import FormInput from "./FormInput";

interface Props {
  selectedCountry: string,
  setSelectedCountry: React.Dispatch<React.SetStateAction<string>>
}

const DeliveryInfo: React.FC<Props> = ({ selectedCountry, setSelectedCountry }) => {
  return (
    <div>
      <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Delivery Information</p>
      <div className="light-component dark:gray-component p-5 pt-3 flex gap-3 flex-col">
        <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
          <div className="md:w-1/2 max-md:w-full">
            <label className="block mb-2" htmlFor={"country/region"}>Country/region</label>
            <CountryDropdown 
              selectedCountry={selectedCountry} 
              setSelectedCountry={setSelectedCountry} 
            />
          </div>
          <FormInput label="Mobile number" type="text" styles="md:w-1/2 max-md:w-full" optionalText={"optional"} maxLength={15} />
        </div>
        <FormInput 
          label="Delivery instructions" 
          type="text" styles="w-full" 
          placeholder="e.g. Leave behind the black bin next to the shed"
          optionalText={"optional"}
          maxLength={100}
        />
        <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
          <FormInput label="Address line 1" type="text" styles="md:w-1/2 max-md:w-full" maxLength={46}  />
          <FormInput label="Address line 2" type="text" styles="md:w-1/2 max-md:w-full" optionalText={"optional"} maxLength={46} />
        </div>
        <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
          <FormInput label="Town/City" type="text" styles="md:w-1/2 max-md:w-full" maxLength={30} />
          <FormInput label="Postcode" type="text" styles="md:w-1/2 max-md:w-full" maxLength={10} />
        </div>
      </div>
    </div>
  )
};

export default DeliveryInfo;