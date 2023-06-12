import { useState, useRef } from "react";
import { TCartItem } from "../../@types/TCartItem";
import useGetCart from "../../hooks/useGetCart";
import CartPriceSummary from "../../components/CartPriceSummary";
import CheckoutItem from "./CheckoutItem";
import FormInput from "./FormInput";
import { checkoutInputChecks } from "../../utils/checkoutInputChecks";
import CountryDropdown from "../../components/CountryDropdown";
import axios, { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import { useNavigate } from "react-router-dom";
import CartPriceSummaryLoading from "../../loading/CartPriceSummaryLoading";
import CheckoutItemsLoading from "../../loading/CheckoutItemsLoading";
import { useDeliveryMethods } from "../../hooks/useDeliveryMethods";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import { TDiscount } from "../../@types/TDiscount";
import BackButton from "../../components/BackButton";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { TErrorMessage } from "../../@types/TErrorMessage";

interface ShippingMethodProps {
  index: number,
  methods: TDeliveryMethod[];
  method: TDeliveryMethod,
}

const Checkout = () => {
  const cartItems = useGetCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const [notEnoughStockItems, setNotEnoughStockItems] = useState<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("United Kingdom 🇬🇧");
  const navigate = useNavigate();
  const deliveryMethods = useDeliveryMethods();
  const [discount, setDiscount] = useState<TDiscount>({ name: "", percent_off: 0 });
  const [discountText, setDiscountText] = useState<string>("");
  const [discountError, setDiscountError] = useState<TErrorMessage>();
  const [selectedMethod, setSelectedMethod] = useState<TDeliveryMethod>();

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

  const updateDeliveryMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const methodName = e.target.value;
    const methodObj = deliveryMethods.methods.find((deliveryMethod) => deliveryMethod.name === methodName);

    if (methodObj) {
      setSelectedMethod(methodObj);
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
      const response = await axios.get<TDiscount>(`users/apply-discount/${code}`);
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

      const orderResponse = await axios.post<{ id: string }>("/users/cart/checkout", {
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

  const backToCart = () => {
    navigate(`/cart`);
  }

  return (
    <div className="max-w-screen-xl m-auto pb-1">
      <BackButton backAction={backToCart} styles="mb-[50px]" />
      <form className="flex max-xl:gap-7 gap-16 max-xl:flex-col-reverse h-fit" ref={formRef}>
        <div className="xl:w-1/2 flex flex-col gap-7">
          <div>
            <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Delivery Information</p>
            <div className="light-component dark:gray-component p-5 pt-3 flex gap-3 flex-col">
              <div className="flex gap-5 items-center max-md:flex-col max-md:gap-3">
                <div className="md:w-1/2 max-md:w-full">
                  <label className="block mb-3" htmlFor={"country/region"}>Country/region</label>
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
        </div>
        <div className="xl:w-1/2 flex flex-col max-xl:flex-col-reverse gap-7">
          <div>
            <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Shipping Method</p>
            <div className="light-component dark:gray-component flex flex-col justify-between" onChange={updateDeliveryMethod}>
              {deliveryMethods.methods.map((method: TDeliveryMethod, index: number) => {
                return (
                  <ShippingMethod 
                    index={index} 
                    methods={deliveryMethods.methods}
                    method={method}
                    key={index}
                  />
                )
              })}
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Order Summary</p>
            <div className="light-component dark:gray-component p-5 flex flex-col justify-between flex-grow">
              {cartItems.cart ? 
              <div className="max-h-[670px] overflow-y-scroll">
                {cartItems.cart.map((cartItem: TCartItem, index: number) => {
                  return (
                    <CheckoutItem
                      key={index} 
                      item={cartItem} 
                      notEnoughStock={notEnoughStockItems.includes(cartItem.curSize.id)}
                      isFirst={index === 0}
                    />
                  )
                })}
              </div> :
              <CheckoutItemsLoading />}
              {cartItems.cart ? 
              <CartPriceSummary 
                subtotal={cartItems.subtotal}
                shipping={selectedMethod ? selectedMethod.price : 0}
                discount={cartItems.subtotal * discount.percent_off}
                styles="pt-6"
              /> : 
              <CartPriceSummaryLoading />}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
};

const ShippingMethod: React.FC<ShippingMethodProps> = ({ index, methods, method }) => {
  return (
    <div className={`${index < methods.length - 1 ? "border-b border-light-border dark:border-main-gray-border" : ""} p-5 flex items-center justify-between`}>
      <div className="flex gap-3 items-center">
        <input type="radio" value={method.name} name="deliveryMethod" />
        <div>
          <p className="font-semibold text-main-text-black dark:text-main-text-white">{method.name}</p>
          <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
            {method.estimated_lower_days === method.estimated_higher_days ? "Overnight" 
            : `${method.estimated_lower_days} - ${method.estimated_higher_days} Business Days`}
          </p>
        </div>
      </div>
      <p className="text-main-text-black dark:text-main-text-white">
        {`£${method.price.toFixed(2)}`}
      </p>
    </div>
  )
}

export default Checkout;