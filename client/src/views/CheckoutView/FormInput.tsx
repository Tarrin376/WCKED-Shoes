import { useState } from "react";
import { checkoutInputChecks } from "../../utils/checkoutInputChecks";
import CardImages from "../../components/CardImages";
import { useWindowSize } from "../../hooks/useWindowSize";

interface Props {
  label: string, 
  styles?: string, 
  type: string,
  placeholder?: string,
  optionalText?: string,
  showCardIcons?: boolean,
  discountText?: string,
  discountError?: string,
  maxLength?: number
}

const FormInput: React.FC<Props> = ({ label, styles, type, placeholder, optionalText, showCardIcons, discountText, discountError, maxLength }) => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const windowSize = useWindowSize();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checkInput = checkoutInputChecks[label];

    if (checkInput === undefined) {
      setValue(value);
      return;
    }
    
    const res = checkInput(value.trim());
    if (!res["valid"]) {
      setErrorMessage(res["message"]);
    } else {
      setErrorMessage("");
    }

    setValue(value);
  };

  return (
    <div className={styles}>
      <div className={`flex ${windowSize <= 360 ? "flex-col" : "items-center gap-3"}`}>
        <label className="block text-main-text-black dark:text-main-text-white" htmlFor={label}>
          {`${label} `}
          {optionalText && <span className="text-side-text-light dark:text-side-text-gray italic">*{optionalText}</span>}
        </label>
        {showCardIcons && <CardImages styles="w-[25px] h-[25px]" />}
      </div>
      {errorMessage && errorMessage.length > 0 && <p className="text-sm mb-[-5px] text-side-text-red">{errorMessage}</p>}
      {discountText && discountText.length > 0 && <p className="text-sm mb-[-5px] text-green-light dark:text-green-dark">{discountText}</p>}
      {discountError && discountError.length > 0 && <p className="text-sm mb-[-5px] text-side-text-red">{discountError}</p>}
      <input 
        type={type} name={label} className={`text-box-light dark:text-box w-full mt-3 text-main-text-black dark:text-main-text-white
        ${errorMessage && errorMessage.length > 0 ? "text-box-error-focus" : ""}`} 
        placeholder={placeholder} value={value} onChange={handleChange} maxLength={maxLength}
      />
    </div>
  )
}

export default FormInput;