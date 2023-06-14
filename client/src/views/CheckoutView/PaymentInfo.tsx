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

interface Props {
  formRef: React.RefObject<HTMLFormElement>,
  selectedMethod: TDeliveryMethod | undefined,
  cartItems: TUseGetCart,
  selectedCountry: string,
  discount: TDiscount,
  setDiscount: React.Dispatch<React.SetStateAction<TDiscount>>,
  setNotEnoughStockItems: React.Dispatch<React.SetStateAction<number[]>>
}

const PaymentInfo: React.FC<Props> = ({ formRef, selectedMethod, cartItems, selectedCountry, discount, setDiscount, setNotEnoughStockItems }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const [discountText, setDiscountText] = useState<string>("");
  const [discountError, setDiscountError] = useState<TErrorMessage>();

  const isValidForm = () => {
    if (!formRef || !formRef.current) {
      return false;
    }

    const formData = new FormData(formRef.current);
    const fieldValues = Object.fromEntries(formData.entries());

    return Object.entries(fieldValues).every((pair) => {
      const name = pair[0] as string;
      const value = pair[1] as string;

      if (name === "country/region" || name === "deliveryMethod" || name === "Apply discount code") {
        return true;
      }

      const valid = checkoutInputChecks[name](value)["valid"];
      return valid;
    });
  }

  const handlePayment = async () => {
    const validForm = isValidForm();

    if (!formRef || !formRef.current) {
      return;
    }

    if (!validForm) {
      setErrorMessage({ message: "One or more required fields are empty or invalid.", status: 400 });
      return;
    }

    if (!selectedMethod) {
      setErrorMessage({ message: "Please select a delivery method.", status: 400 });
      return;
    }

    try {
      const formData = new FormData(formRef.current);
      const fieldValues = Object.fromEntries(formData.entries());
      const cardNum = fieldValues["Credit card number"] as string;

      const orderResponse = await axios.post<{ id: string }>("/api/users/cart/checkout", {
        mobile_number: fieldValues["Mobile number"] as string,
        delivery_instructions: fieldValues["Delivery instructions"] as string,
        address_line1: fieldValues["Address line 1"] as string,
        address_line2: fieldValues["Address line 2"] as string,
        town_or_city: fieldValues["Town/City"] as string,
        postcode: fieldValues["Postcode"] as string,
        first_name: fieldValues["First name"] as string,
        last_name: fieldValues["Last name"] as string,
        email_address: fieldValues["Email address"] as string,
        date_ordered: new Date().toDateString(),
        subtotal: cartItems.subtotal,
        card_end: cardNum.substring(cardNum.length - 4),
        country: selectedCountry,
        delivery_method: selectedMethod!.name,
        discount: discount.name
      });
      
      navigate(`/orders/${orderResponse.data.id}`);
    }
    catch (error: any) {
      const err = error as AxiosError;
      const data = err.response!.data;
      
      if (typeof data === "string") {
        setErrorMessage({ message: data, status: err.response!.status });
      } else {
        setErrorMessage({ message: `Sorry, but some of your items do not have enough stock to satisfy your order. 
        Please reduce their quantities or remove them from your cart.`, status: err.response!.status });
        setNotEnoughStockItems(data as number[]);
      }
    }
  }

  const applyDiscountCode = async () => {
    if (!formRef || !formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const fieldValues = Object.fromEntries(formData.entries());
    const code = fieldValues["Apply discount code"] as string;

    if (code.length === 0) {
      setDiscountText("");
      setDiscountError({ message: "Please enter a valid code", status: 400 });
      return;
    }

    try {
      const response = await axios.get<TDiscount>(`/api/users/apply-discount/${code}`);
      setDiscount(response.data);
      setDiscountText(`You saved ${response.data.percent_off * 100}% off your order!`);
      setDiscountError(undefined);
    }
    catch (error: any) {
      setDiscountText("");
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      setDiscountError(errorMsg);
    }
  }

  return (
    <div className="flex-grow flex flex-col">
      <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Payment</p>
      <div className="light-component dark:gray-component p-5 pt-3 flex justify-between flex-col flex-grow">
        <div className="flex flex-col gap-3">
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
            <FormInput label="First name" type="text" styles="md:w-1/2 max-md:w-full" maxLength={30} />
            <FormInput label="Last name" type="text" styles="md:w-1/2 max-md:w-full" maxLength={30} />
          </div>
          <FormInput label="Email address" type="text" styles="md:w-full max-md:w-full" maxLength={320} />
          <FormInput 
            label="Credit card number" type="text" 
            styles="w-full" showCardIcons={true}
            maxLength={19}
          />
          <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
            <FormInput label="Expiry date" type="text" styles="md:w-1/2 max-md:w-full" optionalText={"yyyy-mm-dd"} maxLength={10} />
            <FormInput label="CVV" type="text" styles="md:w-1/2 max-md:w-full" maxLength={3} />
          </div>
          <FormInput 
            label="Apply discount code" 
            type="text" 
            styles="w-full" 
            optionalText={"No more than 1 per checkout"} 
            discountText={discountText}
            discountError={discountError ? discountError.message : ""}
            maxLength={50}
          />
          <button type="button" className="secondary-btn h-[35px] mt-1 w-fit" onClick={applyDiscountCode}>
            Apply discount
          </button>
        </div>
        <div>
          {cartItems.cart ? 
          <CartPriceSummary 
            subtotal={cartItems.subtotal} 
            shipping={selectedMethod ? selectedMethod.price : 0}
            discount={cartItems.subtotal * discount.percent_off}
            styles="pt-6"
          /> : 
          <CartPriceSummaryLoading />}
          {errorMessage && <ErrorMessage error={errorMessage.message} styles="!mt-4" />}
          <button className={`btn-primary w-full mt-6 h-[45px] text-base ${!cartItems.cart ? "disabled-btn-light dark:disabled-btn" : ""}`} 
          type="button" onClick={handlePayment}>
            Make Payment
          </button>
        </div>
      </div>
    </div>
  )
};

export default PaymentInfo;