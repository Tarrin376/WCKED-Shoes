import { useState } from "react";
import { checkoutInputChecks } from "../../utils/checkoutInputChecks";
import CardImages from "../../components/CardImages";
import { useWindowSize } from "../../hooks/useWindowSize";

interface Props {
  label: string, 
  type: string,
  invalidForm: boolean,
  styles?: string, 
  placeholder?: string,
  optionalText?: string,
  showCardIcons?: boolean,
  discountText?: string,
  discountError?: string,
  maxLength?: number,
  setUppercase?: boolean,
  isOptional?: boolean
}

const FormInput: React.FC<Props> = (props) => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const windowSize = useWindowSize();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = props.setUppercase ? e.target.value.toUpperCase() : e.target.value;
    const checkInput = checkoutInputChecks[props.label];

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
    <div className={props.styles}>
      <div className={`flex ${windowSize <= 360 ? "flex-col" : "items-center gap-3"}`}>
        <label className="block text-main-text-black dark:text-main-text-white" htmlFor={props.label}>
          {`${props.label} `}
          {props.optionalText && <span className="text-side-text-light dark:text-side-text-gray italic">*{props.optionalText}</span>}
        </label>
        {props.showCardIcons && <CardImages styles="w-[25px] h-[25px]" />}
      </div>
      {errorMessage && errorMessage.length > 0 ? 
        <p className="text-sm text-side-text-red">
          {errorMessage}
        </p> :
        props.invalidForm && !props.isOptional && value.length === 0 && 
        <p className="text-sm text-side-text-red">
          Must not be empty
        </p>}
      {props.discountText && props.discountText.length > 0 && 
      <p className="text-sm text-green-light dark:text-green-dark">
        {props.discountText}
      </p>}
      {props.discountError && props.discountError.length > 0 && 
      <p className="text-sm text-side-text-red">
        {props.discountError}
      </p>}
      <input 
        type={props.type} name={props.label} className={`text-box-light dark:text-box w-full mt-2 text-main-text-black dark:text-main-text-white
        ${(errorMessage && errorMessage.length > 0) || (props.invalidForm && !props.isOptional && value.length === 0) ? "text-box-error-focus" : ""}`} 
        placeholder={props.placeholder} value={value} onChange={handleChange} maxLength={props.maxLength}
      />
    </div>
  )
}

export default FormInput;