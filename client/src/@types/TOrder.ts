import { TOrderStatus } from "./TOrderStatus";
import { TDeliveryMethod } from "./TDeliveryMethod";
import { TDiscount } from "./TDiscount";

export type TOrder = {
  id: number,
  date_ordered: string,
  processing_date: string,
  shipped_date: string,
  delivered_date: string,
  order_status: TOrderStatus,
  total_cost: number,
  address_line1: string,
  address_line2: string,
  town_or_city: string,
  postcode: string,
  mobile_number: string,
  card_end: string,
  country: string,
  delivery_method: TDeliveryMethod,
  discount: TDiscount,
  cancelled: boolean,
  delivery_instructions: string
}