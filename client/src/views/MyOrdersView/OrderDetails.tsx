import { TOrder } from "../../@types/TOrder";
import CardImages from "../../components/CardImages";

interface Props {
  order: TOrder
}

interface OrderInfoProps {
  info: string, 
  title: string, 
  stylesOuter?: string, 
  stylesInner?: string,
}

const OrderDetails: React.FC<Props> = ({ order }) => {
  return (
    <div className="p-3 mt-3 mb-3 pb-0 flex max-lg:flex-col gap-6 max-md:gap-4 items-center">
      <div className="flex lg:gap-6 max-md:gap-4 items-center w-2/3 max-lg:w-full max-md:flex-col">
        <div className="w-1/2 max-md:w-full pb-1 md:border-r md:pr-6 md:border-light-border">
          <h4 className="text-[19px] mb-2 font-semibold max-xl:text-center">Customer Info</h4>
          <OrderInfo info={order.mobile_number} title="Mobile Number" stylesOuter="mb-1 max-xl:items-center" stylesInner="text-side-text-blue" />
          <OrderInfo info={order.country} title="Country" stylesOuter="mb-1 max-xl:items-center" stylesInner="text-main-text-black dark:text-main-text-white" />
          <OrderInfo info={order.postcode} title="Postcode" stylesOuter="mb-1 max-xl:items-center" stylesInner="text-main-text-black dark:text-main-text-white" />
          <div className="flex flex-wrap max-xl:items-center max-xl:flex-col justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[15px] text-side-text-light dark:text-side-text-gray">Card Number</p>
              <CardImages styles="w-[25px] h-[25px]" />
            </div>
            <p className="text-[15px] text-side-text-blue">{`****${order.card_end}`}</p>
          </div>
        </div>
        <div className="w-1/2 max-md:w-full pb-1 lg:border-r lg:pr-6 max-lg:pl-6 max-md:pl-0 lg:border-light-border max-lg:pr-0">
          <h4 className="text-[19px] mb-2 font-semibold max-xl:text-center">Delivery Details</h4>
          <OrderInfo info={order.town_or_city} title="Town/City" stylesOuter="mb-1 max-xl:items-center" stylesInner="text-main-text-black dark:text-main-text-white" />
          <OrderInfo 
            info={order.delivery_method.estimated_lower_days === order.delivery_method.estimated_higher_days ? "Overnight" : 
            `${order.delivery_method.estimated_lower_days} - ${order.delivery_method.estimated_higher_days} Business Days`} 
            title="Est. arrival" 
            stylesOuter="mb-1 max-xl:items-center" 
            stylesInner="text-main-text-black dark:text-main-text-white" 
          />
          <OrderInfo 
            info={order.order_status} 
            title="Status" 
            stylesOuter="mb-1 max-xl:items-center"
            stylesInner="text-main-text-black dark:text-main-text-white" 
          />
          <OrderInfo 
            info={order.delivery_method.name} 
            title="Delivery method"
            stylesInner="text-main-text-black dark:text-main-text-white"
            stylesOuter="max-xl:items-center"
          />
        </div>
      </div>
      <div className="w-1/3 pb-1 max-lg:w-full">
        <h4 className="text-[19px] mb-2 font-semibold max-xl:text-center">Shipping Info</h4>
        <OrderInfo 
          info={`£${order.delivery_method.price.toFixed(2)}`} 
          title={"Shipping cost"} 
          stylesOuter={"mb-1 max-xl:text-center"} 
          stylesInner={"text-main-text-black dark:text-main-text-white"} 
        />
        <OrderInfo 
          info={`${order.address_line1} ${order.address_line2.length > 0 ? `| ${order.address_line2}` : ""}`} 
          title={"Address"} 
          stylesOuter={"mb-1 flex-col max-xl:text-center xl:!items-start"} 
          stylesInner={"text-main-text-black dark:text-main-text-white"} 
        />
      </div>
    </div>
  )
};

const OrderInfo: React.FC<OrderInfoProps> = ({ info, title, stylesOuter, stylesInner }) => {
  return (
    <div className={`flex max-xl:flex-col justify-between xl:items-center ${stylesOuter}`}>
      <p className={`text-[15px] text-side-text-light dark:text-side-text-gray`}>{title}</p>
      <p className={`text-[15px] ${stylesInner}`}>{info}</p>
    </div>
  )
}

export default OrderDetails;