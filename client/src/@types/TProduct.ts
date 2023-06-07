import { TProductCard } from "./TProductCard"
import { TReview } from "./TReview"
import { TSize } from "./TSize"

export type TProduct = TProductCard & {
  num_reviews: number,
  description: string
  images: readonly string[],
  reviews: readonly TReview[],
  sizes: readonly TSize[]
}