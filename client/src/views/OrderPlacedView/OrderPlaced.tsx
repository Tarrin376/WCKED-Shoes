import { useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { convertDate } from "../../utils/convertDate";
import OrderedItem from "./OrderedItem";
import { TOrderedItem } from "../../@types/TOrderedItem";
import AirplaneIconDark from "../../assets/airplane.png";
import AirplaneIconLight from "../../assets/airplane-light.png";
import CardImages from "../../components/CardImages";
import { ThemeContext } from "../../providers/ThemeProvider";
import { TOrderData } from "../../@types/TOrderData";
import { getShortDateFormatRange } from "../../utils/getShortDateFormatRange";
import OrderPlacedLoading from "../../loading/OrderPlacedLoading";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { useWindowSize } from "../../hooks/useWindowSize";
import { TErrorMessage } from "../../@types/TErrorMessage";
import { useNavigateErrorPage } from "../../hooks/useNavigateErrorPage";

const OrderPlaced = () => {
  const location = useLocation();
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const [orderData, setOrderData] = useState<TOrderData>();
  const subtotal = orderData ? orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const navigate = useNavigateErrorPage(errorMessage);
  const windowSize = useWindowSize();

  useEffect(() => {
    (async () => {
      try {
        const orderResponse = await axios.get<TOrderData>(`/api${location.pathname}`);
        setOrderData(orderResponse.data);
      }
      catch (error: any) {
        const errorMsg = getAPIErrorMessage(error as AxiosError<{ error: string }>);
        setErrorMessage(errorMsg);
      }
    })()
  }, [location.pathname]);

  if (!orderData) {
    return <OrderPlacedLoading />
  }

  const backToProductsPage = () => {
    navigate("/");
    window.scrollTo(0, 0);
  }
  
  return (
    <div className="max-w-screen-xl m-auto">
      <h1 className="text-[30px] text-main-text-black dark:text-main-text-white w-fit text-center m-auto">Your order has been placed!</h1>
      <p className="w-fit m-auto mt-5 text-side-text-light dark:text-side-text-gray max-w-[700px] text-center mb-[70px]">
        Hi <span className="font-semibold">{userContext?.email}</span> we have recieved your order and are getting it ready to be shipped. 
        We will notify you when it's on its way!
      </p>
      <h2 className="text-main-text-black dark:text-main-text-white font-semibold text-[25px] mb-5">
        Order ID:
        <span className="ml-2 font-normal">
          {`#${orderData.order_details.id}`}
        </span>
      </h2>
      <div className="flex max-lg:flex-col gap-2 justify-between pb-4 border-b border-b-light-border dark:border-b-main-gray-border">
        <p className="text-side-text-light dark:text-side-text-gray">
          Order Date:
          <span className="ml-2 text-main-text-black dark:text-main-text-white">
            {convertDate(orderData.order_details.date_ordered)}
          </span>
        </p>
        <div className="flex items-center justify-between gap-7 max-md:flex-col max-md:items-start max-md:gap-3">
          <div className={`flex items-center ${windowSize > 370 ? "gap-2" : "gap-0"}`}>
            <img src={themeContext?.darkMode ? AirplaneIconDark : AirplaneIconLight} className="w-[16px] h-[16px]" alt="" />
            <p className="dark:text-in-stock-green-text-dark text-in-stock-green-text">
              {windowSize > 370 && <span>Estimated delivery:</span>}
              <span className="ml-2">
                {getShortDateFormatRange(
                  orderData.order_details.delivery_method.estimated_lower_days, 
                  orderData.order_details.delivery_method.estimated_higher_days)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="max-h-[600px] overflow-y-scroll">
        {orderData.items.map((item: TOrderedItem, index) => {
          return (
            <OrderedItem 
              item={item}
              key={index}
            />
          );
        })}
      </div>
      <div className="mt-6 flex max-lg:flex-col justify-between gap-10 max-lg:gap-4 bg-[#f9f9fa] dark:bg-[#161616] p-5 rounded-[8px]">
        <div className="flex lg:w-[55%] max-lg:w-full gap-10 max-lg:gap-4 max-md:flex-col">
          <div className="w-fit max-lg:w-full">
            <h3 className="text-[18px] text-main-text-black dark:text-main-text-white font-semibold mb-3">Payment</h3>
            <div className="text-side-text-light dark:text-side-text-gray text-[15px] whitespace-nowrap">
              Credit card ending with
              <span className="text-bg-primary-btn-hover">{` ${orderData.order_details.card_end}`}</span>
            </div>
            <CardImages styles={"w-[25px] h-[25px]"} />
          </div>
          <div className="flex-grow max-lg:w-full max-lg:pb-[6px] max-lg:text-right max-md:!text-left">
            <h3 className="text-[18px] mb-3 text-main-text-black dark:text-main-text-white font-semibold">Delivery</h3>
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray mb-[4px]">Address</p>
            <p className="text-main-text-black dark:text-main-text-white">
              {`${orderData.order_details.address_line1}${orderData.order_details.address_line2.length > 0 ? `, ${orderData.order_details.address_line2}` : ""}`}
            </p>
            <p className="text-main-text-black dark:text-main-text-white">{orderData.order_details.town_or_city}</p>
            <p className="text-main-text-black dark:text-main-text-white">{orderData.order_details.country}</p>
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray mt-3 mb-[4px]">Phone number</p>
            <p className="text-bg-primary-btn-hover">{orderData.order_details.mobile_number}</p>
          </div>
        </div>
        <div className="flex-grow max-lg:border-t max-lg:border-light-border max-lg:dark:border-t-main-gray-border max-lg:pt-5">
          <h3 className="text-[18px] mb-[11px] text-main-text-black dark:text-main-text-white font-semibold">Order Summary</h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-main-text-black dark:text-main-text-white text-[18px]">Subtotal</p>
            <p className="text-main-text-black dark:text-main-text-white text-[18px]">£{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
              Discount:
            </p>
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
              {`- £${(subtotal * orderData.order_details.discount.percent_off).toFixed(2)}
              (${orderData.order_details.discount.percent_off * 100}% off)`}
            </p>
          </div>
          <div className="flex justify-between items-center pb-4 border-dashed border-b border-b-light-border dark:border-b-main-gray-border">
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray">Shipping</p>
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray">£{orderData.order_details.delivery_method.price.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-[18px] text-main-text-black dark:text-main-text-white">Total</p>
            <p className="text-[18px] text-main-text-black dark:text-main-text-white font-semibold">£{(orderData.order_details.total_cost).toFixed(2)}</p>
          </div>
        </div>
      </div>
      <button className="btn-primary w-[180px] h-[45px] m-auto block mt-[70px]" onClick={backToProductsPage}>
        Continue shopping
      </button>
    </div>
  )
};

export default OrderPlaced;