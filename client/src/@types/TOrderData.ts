import { TOrder } from "./TOrder";
import { TOrderedItem } from "./TOrderedItem";

export type TOrderData = {
  order_details: TOrder, 
  items: TOrderedItem[]
}