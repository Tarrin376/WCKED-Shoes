import { TSize } from "./TSize"

export type TProductCard = {
  id: number,
  name: string,
  rating: number,
  price: number,
  carbon_footprint: number,
  num_sold: number,
  thumbnail: string,
  stock: number,
  sizes: readonly TSize[]
}