import { useState, useRef } from "react";
import useGetCart from "../../hooks/useGetCart";
import { useNavigate } from "react-router-dom";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import { TDiscount } from "../../@types/TDiscount";
import BackButton from "../../components/BackButton";
import DeliveryInfo from "./DeliveryInfo";
import PaymentInfo from "./PaymentInfo";
import ShippingMethods from "./ShippingMethods";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const cartItems = useGetCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [notEnoughStockItems, setNotEnoughStockItems] = useState<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("United Kingdom 🇬🇧");
  const [discount, setDiscount] = useState<TDiscount>({ name: "", percent_off: 0 });
  const [selectedMethod, setSelectedMethod] = useState<TDeliveryMethod>();
  const navigate = useNavigate();

  const backToBag = () => {
    navigate(`/cart`);
    window.scrollTo(0, 0);
  }

  return (
    <div className="max-w-screen-xl m-auto pb-1">
      <BackButton backAction={backToBag} styles="mb-[50px]" text="Back to your bag" />
      <form className="flex max-xl:gap-7 gap-16 max-xl:flex-col-reverse h-fit" ref={formRef}>
        <div className="xl:w-1/2 flex flex-col gap-7">
          <DeliveryInfo 
            selectedCountry={selectedCountry} 
            setSelectedCountry={setSelectedCountry} 
          />
          <PaymentInfo 
            formRef={formRef}
            selectedMethod={selectedMethod}
            cartItems={cartItems}
            selectedCountry={selectedCountry}
            discount={discount}
            setDiscount={setDiscount}
            setNotEnoughStockItems={setNotEnoughStockItems}
          />
        </div>
        <div className="xl:w-1/2 flex flex-col max-xl:flex-col-reverse gap-7">
          <ShippingMethods setSelectedMethod={setSelectedMethod} />
          <OrderSummary
            cartItems={cartItems}
            notEnoughStockItems={notEnoughStockItems}
            selectedMethod={selectedMethod}
            discount={discount}
          />
        </div>
      </form>
    </div>
  )
};

export default Checkout;