import { TCartItem } from "./TCartItem"

export type TUseGetCart = {
  subtotal: number,
  cart: TCartItem[] | undefined,
  setCart: React.Dispatch<React.SetStateAction<TCartItem[] | undefined>>
}