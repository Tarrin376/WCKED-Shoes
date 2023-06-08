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
}

const orderStatusColours: {
  [key in TOrderStatus]: string
} = {
  "Order Created": "text-main-text-black dark:text-main-text-white",
  "Processing": "text-main-text-black dark:text-main-text-white",
  "Shipped": "text-main-text-black dark:text-main-text-white",
  "Delivered": "text-green-light dark:text-green-dark",
}

const Order: React.FC<Props> = ({ orderData }) => {
  const themeContext = useContext(ThemeContext);
  const [orderDetailsPopUp, setOrderDetailsPopUp] = useState(false);
  const [orderHistoryPopUp, setOrderHistoryPopUp] = useState(false);
  const [cancelOrderPopUp, setCancelOrderPopUp] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState(false);
  const windowSize = useWindowSize();

  const togglePopUps = (orderDetails: boolean, orderHistory: boolean, cancelOrder: boolean) => {
    setOrderDetailsPopUp(orderDetails);
    setOrderHistoryPopUp(orderHistory);
    setCancelOrderPopUp(cancelOrder);
  }

  const toggleDeliveryInstructions = () => {
    setDeliveryInstructions((cur) => !cur);
  }

  return (
    <OutsideClickHandler onOutsideClick={() => togglePopUps(false, false, false)}>
      <div className="light-component dark:gray-component overflow-hidden">
        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1d] p-4 pt-3 flex justify-between items-center">
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
              <h4 className="text-[19px] font-semibold text-side-text-light dark:text-side-text-gray">
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
              <p className="text-green-light dark:text-green-dark">
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
              <p className="text-side-text-blue">
                {deliveryInstructions ? "Hide Delivery Instructions" : "Show Delivery instructions"}
              </p>
            </div>}
            {deliveryInstructions &&
            <p className="text-side-text-light dark:text-side-text-gray ml-[23px]">
              {orderData.order_details.delivery_instructions}
            </p>}
          </div>
          <div className="flex-grow overflow-y-scroll bg-[#f9f9fa] dark:bg-[#1a1a1a] p-3 max-lg:py-0 rounded-[8px] max-h-[400px]">
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
            <button className="bg-main-red hover:bg-main-red-hover px-4 h-[37px] text-main-text-white btn"
            onClick={() => togglePopUps(false, false, !cancelOrderPopUp)}>
              Cancel Order
            </button>}
            <div className="flex gap-3 max-xs:flex-col">
              <button className="text-main-text-black bg-[#ececee] hover:bg-[#e6e6e7] dark:bg-[#464646] dark:dark:hover:bg-[#4e4e4e] 
              dark:text-main-text-white rounded-md px-4 flex-grow h-[37px] btn" onClick={() => togglePopUps(!orderDetailsPopUp, false, false)}>
                {orderDetailsPopUp ? "Hide order details" : "Show order details"}
              </button>
              {!orderData.order_details.cancelled && 
              <button className="text-main-text-black bg-[#ececee] hover:bg-[#e6e6e7] dark:bg-[#464646] dark:dark:hover:bg-[#4e4e4e] 
              dark:text-main-text-white rounded-md px-4 flex-grow h-[37px] btn" onClick={() => togglePopUps(false, !orderHistoryPopUp, false)}>
                {orderHistoryPopUp ? "Hide order activity" : "View order activity"}
              </button>}
            </div>
          </div>
          {orderDetailsPopUp && <OrderDetails order={orderData.order_details} />}
          {cancelOrderPopUp && <CancelOrder orderID={orderData.order_details.id} />}
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
    <p className={`text-[15px] text-side-text-light dark:text-side-text-gray ${windowSize <= 618 ? "mt-[6px]" : ""}`}>
      {"Discount code: "}
      <span className={`text-side-text-blue ${cancelled && name !== "N/A" ? "line-through" : ""}`}>
        {`${name}${name !== "N/A" ? 
        ` (${(percentOff * 100).toFixed(2)}% off)` : ""}`}
      </span>
    </p>
  )
}

export default Order;