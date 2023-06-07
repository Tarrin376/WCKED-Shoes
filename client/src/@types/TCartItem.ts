import { TSize } from "./TSize";

export type TCartItem = {
  quantity: number,
  courier: string,
  product_name: string,
  price: number,
  thumbnail: string,
  curSize: TSize,
  product_id: string
}