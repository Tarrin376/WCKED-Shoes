
export type TReview = {
  id: number,
  user_id: number,
  product_id: number,
  rating: number,
  title: string,
  review: string,
  date_posted: string,
  helpful_count: number,
  is_marked: boolean
}