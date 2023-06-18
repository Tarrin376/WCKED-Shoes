import { TOrderData } from "../../@types/TOrderData";
import { convertDate } from "../../utils/convertDate";
import AirplaneIconDark from "../../assets/airplane.png";
import AirplaneIconLight from "../../assets/airplane-light.png";
import { ThemeContext } from "../../providers/ThemeProvider";
import { useContext } from "react";
import OrderedItem from "../OrderPlacedView/OrderedItem";
import OrderDetails from "./OrderDetails";
import { useState } from "react";
import OrderActivity from "./OrderActivity";
import { getShortDateFormatRange } from "../../utils/getShortDateFormatRange";
import OutsideClickHandler from "react-outside-click-handler";
import { useWindowSize } from "../../hooks/useWindowSize";
import CancelOrder from "./CancelOrder";
import DeliveryInstructionsIcon from "../../assets/delivery-instructions.png";
import { TOrderStatus } from "../../@types/TOrderStatus";

interface Props {
  orderData: TOrderData,
  disabled: boolean,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const orderStatusColours: {
  [key in TOrderStatus]: string
} = {
  "Order Created": "text-main-text-black dark:text-main-text-white",
  "Processing": "text-main-text-black dark:text-main-text-white",
  "Shipped": "text-main-text-black dark:text-main-text-white",
  "Delivered": "text-in-stock-green-text dark:text-in-stock-green-text-dark",
}

const Order: React.FC<Props> = ({ orderData, disabled, setDisabled }) => {
  const themeContext = useContext(ThemeContext);
  const [orderDetailsPopUp, setOrderDetailsPopUp] = useState(false);
  const [orderHistoryPopUp, setOrderHistoryPopUp] = useState(false);
  const [cancelOrderPopUp, setCancelOrderPopUp] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState(false);
  const [hide, setHide] = useState<boolean>(false);
  const windowSize = useWindowSize();

  const togglePopUps = (orderDetails: boolean, orderHistory: boolean, cancelOrder: boolean) => {
    setOrderDetailsPopUp(orderDetails);
    setOrderHistoryPopUp(orderHistory);
    setCancelOrderPopUp(cancelOrder);
  }

  const toggleDeliveryInstructions = () => {
    setDeliveryInstructions((cur) => !cur);
  }

  if (hide) {
    return <></>
  }

  return (
    <OutsideClickHandler onOutsideClick={() => togglePopUps(false, false, false)}>
      <div className="light-component dark:gray-component overflow-hidden">
        <div className="bg-[#f5f5f7] dark:bg-[#1b1b1b] p-4 pt-3 flex justify-between items-center">
          <div className={`flex flex-grow ${windowSize >= 400 ? "gap-10" : "justify-between"}`}>
            <div>
              <p className="font-semibold">Order placed</p>
              <p>{convertDate(orderData.order_details.date_ordered)}</p>
            </div>
            <div>
              <p className={`font-semibold ${windowSize >= 400 ? "" : "text-right"}`}>Total</p>
              <p>{`£${orderData.order_details.total_cost.toFixed(2)}`}</p>
            </div>
          </div>
          {windowSize >= 400 && 
          <div className="flex gap-10">
            <div>
            <p className="font-semibold">Order ID</p>
              <p className="text-right">{`#${orderData.order_details.id}`}</p>
            </div>
          </div>}
        </div>
        <div className={`p-4 pt-3 flex flex-col`}>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[19px] font-semibold text-main-text-black dark:text-main-text-white">
                Status:
                {orderData.order_details.cancelled ? 
                <span className="text-side-text-red">
                  {` Cancelled`}
                </span> :
                <span className={orderStatusColours[orderData.order_details.order_status]}>
                  {` ${orderData.order_details.order_status}`}
                </span>}
              </h4>
              {windowSize > 618 && 
              <DiscountText 
                name={orderData.order_details.discount.name} 
                percentOff={orderData.order_details.discount.percent_off}
                cancelled={orderData.order_details.cancelled}
              />}
            </div>
            {windowSize <= 618 && 
            <DiscountText 
              name={orderData.order_details.discount.name} 
              percentOff={orderData.order_details.discount.percent_off} 
              cancelled={orderData.order_details.cancelled}
            />}
            {windowSize < 400 && 
            <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
              Order ID:
              <span className="text-bg-primary-btn-hover">
                {` #${orderData.order_details.id}`}
              </span>
            </p>}
            {!orderData.order_details.cancelled && 
            <div className="flex items-center gap-[7px] mt-[6px]">
              <img src={themeContext?.darkMode ? AirplaneIconDark : AirplaneIconLight} className="w-[16px] h-[16px]" alt="" />
              <p className="text-in-stock-green-text dark:text-in-stock-green-text-dark">
                {orderData.order_details.order_status === "Delivered" ? 
                `Delivered on ${convertDate(orderData.order_details.delivered_date, true)}`
                : `${windowSize <= 480 ? "" : "Estimated Delivery: "}${getShortDateFormatRange(orderData.order_details.delivery_method.estimated_lower_days, 
                  orderData.order_details.delivery_method.estimated_higher_days)}`}
              </p>
            </div>}
            {orderData.order_details.delivery_instructions.length > 0 && orderData.order_details.order_status !== "Delivered" 
            && !orderData.order_details.cancelled &&
            <div className="flex items-center gap-[7px] cursor-pointer mt-[1px]" onClick={toggleDeliveryInstructions}>
              <img src={DeliveryInstructionsIcon} className="w-[16px] h-[16px]" alt="" />
              <p className="text-bg-primary-btn-hover">
                {deliveryInstructions ? "Hide Delivery Instructions" : "Show Delivery instructions"}
              </p>
            </div>}
            {deliveryInstructions &&
            <p className="text-side-text-light dark:text-side-text-gray ml-[23px]">
              {orderData.order_details.delivery_instructions}
            </p>}
          </div>
          <div className="flex-grow overflow-y-scroll bg-[#f9f9fa] dark:bg-[#181818] p-3 pr-0 max-lg:py-0 rounded-[8px] max-h-[400px]">
            {orderData.items.map((item, index) => {
              return (
                <OrderedItem 
                  item={item} 
                  isFirst={index === 0} 
                  noBorder={index === orderData.items.length - 1}
                  key={index} 
                  styles={"!py-3 max-lg:!py-0"}
                  buyAgain={true}
                />
              )
            })}
          </div>
          <div className="mt-5 flex max-md:flex-col-reverse gap-3">
            {orderData.order_details.order_status === "Order Created" && !orderData.order_details.cancelled &&
            <button className={`danger-btn ${disabled ? "pointer-events-none disabled-btn-light dark:disabled-btn" : ""}`} 
            onClick={() => togglePopUps(false, false, !cancelOrderPopUp)}>
              Cancel Order
            </button>}
            <div className="flex gap-3 max-xs:flex-col">
              <button className={`secondary-btn flex-grow ${disabled ? "pointer-events-none disabled-btn-light dark:disabled-btn" : ""}`} 
              onClick={() => togglePopUps(!orderDetailsPopUp, false, false)}>
                {orderDetailsPopUp ? "Hide order details" : "Show order details"}
              </button>
              {!orderData.order_details.cancelled && 
              <button className={`secondary-btn flex-grow ${disabled ? "pointer-events-none disabled-btn-light dark:disabled-btn" : ""}`} 
              onClick={() => togglePopUps(false, !orderHistoryPopUp, false)}>
                {orderHistoryPopUp ? "Hide order activity" : "View order activity"}
              </button>}
            </div>
          </div>
          {orderDetailsPopUp && <OrderDetails order={orderData.order_details} />}
          {cancelOrderPopUp && 
          <CancelOrder 
            orderID={orderData.order_details.id} 
            setDisabled={setDisabled}
            setHide={setHide}
          />}
          {orderHistoryPopUp &&
          <OrderActivity 
            dates={[
              { "label": "Order Created", "date": orderData.order_details.date_ordered },
              { "label": "Processing", "date": orderData.order_details.processing_date },
              { "label": "Shipped", "date": orderData.order_details.shipped_date },
              { "label": "Delivered", "date": orderData.order_details.delivered_date },
            ]}
            estDelivery={getShortDateFormatRange(
              orderData.order_details.delivery_method.estimated_lower_days, 
              orderData.order_details.delivery_method.estimated_higher_days)}
          />}
        </div>
      </div>
    </OutsideClickHandler>
  )
};

const DiscountText: React.FC<{ name: string, percentOff: number, cancelled: boolean }> = ({ name, percentOff, cancelled }) => {
  const windowSize = useWindowSize();
  return (
    <p className={`text-[15px] text-side-text-light dark:text-main-text-white ${windowSize <= 618 ? "mt-[6px]" : ""}`}>
      {"Discount code: "}
      <span className={`text-bg-primary-btn-hover ${cancelled && name !== "N/A" ? "line-through" : ""}`}>
        {`${name}${name !== "N/A" ? 
        ` (${(percentOff * 100).toFixed(2)}% off)` : ""}`}
      </span>
    </p>
  )
}

export default Order;