import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import { checkoutInputChecks } from "../../utils/checkoutInputChecks";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { useState } from "react";
import { TErrorMessage } from "../../@types/TErrorMessage";
import axios, { AxiosError } from "axios";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import { TUseGetCart } from "../../@types/TUseGetCart";
import CartPriceSummary from "../../components/CartPriceSummary";
import { TDiscount } from "../../@types/TDiscount";
import CartPriceSummaryLoading from "../../loading/CartPriceSummaryLoading";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";

interface Props {
  formRef: React.RefObject<HTMLFormElement>,
  selectedMethod: TDeliveryMethod | undefined,
  cartItems: TUseGetCart,
  selectedCountry: string,
  discount: TDiscount,
  setDiscount: React.Dispatch<React.SetStateAction<TDiscount>>,
  setNotEnoughStockItems: React.Dispatch<React.SetStateAction<number[]>>,
  setInvalidForm: React.Dispatch<React.SetStateAction<boolean>>,
  invalidForm: boolean
}

const PaymentInfo: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const [discountText, setDiscountText] = useState<string>("");
  const [discountError, setDiscountError] = useState<TErrorMessage>();

  const isValidForm = () => {
    if (!props.formRef || !props.formRef.current) {
      return false;
    }

    const formData = new FormData(props.formRef.current);
    const fieldValues = Object.fromEntries(formData.entries());

    return Object.entries(fieldValues).every((pair) => {
      const name = pair[0] as string;
      const value = (pair[1] as string).trim();

      if (name === "country/region" || name === "deliveryMethod" || name === "Apply discount code") {
        return true;
      }

      const valid = checkoutInputChecks[name](value)["valid"];
      return valid;
    });
  }

  const handlePayment = async (): Promise<TErrorMessage | undefined> => {
    const validForm = isValidForm();

    if (!props.formRef || !props.formRef.current) {
      return { message: "Form has not been initialized yet.", status: 400 };
    }

    if (!validForm) {
      props.setInvalidForm(true);
      return { message: "One or more required fields are empty or invalid.", status: 400 };
    }

    if (!props.selectedMethod) {
      return { message: "Please select a delivery method.", status: 400 };
    }

    try {
      const formData = new FormData(props.formRef.current);
      const fieldValues = Object.fromEntries(formData.entries());
      const cardNum = (fieldValues["Credit card number"] as string).trim();

      const orderResponse = await axios.post<{ id: string }>(`/api/users/cart/checkout`, {
        mobile_number: (fieldValues["Mobile number"] as string).trim(),
        delivery_instructions: (fieldValues["Delivery instructions"] as string).trim(),
        address_line1: (fieldValues["Address line 1"] as string).trim(),
        address_line2: (fieldValues["Address line 2"] as string).trim(),
        town_or_city: (fieldValues["Town/City"] as string).trim(),
        postcode: (fieldValues["Postcode"] as string).trim(),
        first_name: (fieldValues["First name"] as string).trim(),
        last_name: (fieldValues["Last name"] as string).trim(),
        email_address: (fieldValues["Email address"] as string).trim(),
        date_ordered: new Date().toDateString(),
        subtotal: props.cartItems.subtotal,
        card_end: cardNum.substring(cardNum.length - 4),
        country: props.selectedCountry,
        delivery_method: props.selectedMethod!.name,
        discount: props.discount.name
      });
      
      navigate(`/orders/${orderResponse.data.id}`);
      window.scrollTo(0, 0);
    }
    catch (error: any) {
      const err = error as AxiosError;
      const data = err.response!.data;
      
      if (typeof data === "string") {
        return { message: data, status: err.response!.status };
      } else {
        props.setNotEnoughStockItems(data as number[]);
        return { message: `Sorry, but some of your items do not have enough stock to satisfy your order. 
        Please reduce their quantities or remove them from your cart.`, status: err.response!.status };
      }
    }
  }

  const applyDiscountCode = async (): Promise<TErrorMessage | undefined> => {
    if (!props.formRef || !props.formRef.current) {
      return;
    }

    const formData = new FormData(props.formRef.current);
    const fieldValues = Object.fromEntries(formData.entries());
    const code = (fieldValues["Apply discount code"] as string).trim();

    if (code.length === 0) {
      setDiscountText("");
      return { message: "Please enter a valid code", status: 400 };
    }

    try {
      const response = await axios.get<TDiscount>(`/api/users/apply-discount/${code}`);
      props.setDiscount(response.data);
      setDiscountText(`You saved ${response.data.percent_off * 100}% off your order!`);
    }
    catch (error: any) {
      setDiscountText("");
      const errorMsg = getAPIErrorMessage(error as AxiosError<{ error: string }>);
      return errorMsg;
    }
  }

  return (
    <div className="flex-grow flex flex-col">
      <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Payment</p>
      <div className="light-component dark:gray-component p-5 pt-3 flex justify-between flex-col flex-grow">
        <div className="flex flex-col gap-3">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
            <FormInput 
              label="First name" 
              type="text" 
              styles="md:w-1/2 max-md:w-full" 
              maxLength={30}
              invalidForm={props.invalidForm}
            />
            <FormInput 
              label="Last name" 
              type="text" 
              styles="md:w-1/2 max-md:w-full" 
              maxLength={30}
              invalidForm={props.invalidForm}
            />
          </div>
          <FormInput 
            label="Email address" 
            type="text" 
            styles="md:w-full max-md:w-full" 
            maxLength={320}
            invalidForm={props.invalidForm}
          />
          <FormInput 
            label="Credit card number" type="text" 
            styles="w-full" 
            showCardIcons={true}
            maxLength={19}
            invalidForm={props.invalidForm}
          />
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
            <FormInput 
              label="Expiry date" 
              type="text" 
              styles="md:w-1/2 max-md:w-full" 
              optionalText={"yyyy-mm-dd"} 
              maxLength={10} 
              invalidForm={props.invalidForm}
            />
            <FormInput 
              label="CVV" 
              type="text" 
              styles="md:w-1/2 max-md:w-full" 
              maxLength={3} 
              invalidForm={props.invalidForm}
            />
          </div>
          <FormInput 
            label="Apply discount code" 
            type="text" 
            styles="w-full" 
            optionalText={"No more than 1 per checkout"} 
            discountText={discountText}
            discountError={discountError ? discountError.message : ""}
            maxLength={50}
            setUppercase={true}
            invalidForm={props.invalidForm}
          />
          <Button
            action={applyDiscountCode}
            completedText="Applied discount"
            defaultText="Apply discount"
            loadingText="Applying discount"
            styles="secondary-btn h-[35px] mt-1 w-fit"
            setErrorMessage={setDiscountError}
          />
        </div>
        <div>
          {props.cartItems.cart ? 
          <CartPriceSummary 
            subtotal={props.cartItems.subtotal} 
            shipping={props.selectedMethod ? props.selectedMethod.price : 0}
            discount={props.cartItems.subtotal * props.discount.percent_off}
            styles="pt-6"
          /> : 
          <CartPriceSummaryLoading />}
          {errorMessage && <ErrorMessage error={errorMessage.message} styles="!mt-4" />}
          <Button 
            action={handlePayment}
            completedText="Payment Confirmed"
            defaultText="Make Payment"
            loadingText="Processing Payment"
            styles={`btn-primary w-full mt-6 h-[45px] text-base ${!props.cartItems.cart ? "disabled-btn-light dark:disabled-btn" : ""}`}
            setErrorMessage={setErrorMessage}
          />
        </div>
      </div>
    </div>
  )
};

export default PaymentInfo;