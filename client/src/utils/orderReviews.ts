import { TReviewOptions } from "../@types/TReviewOptions";
import { TOrderByOption } from "../@types/TOrderByOption";

export const orderReviews: TOrderByOption<TReviewOptions>[] = [
  {
    label: "Most helpful",
    orderBy: "helpful-count",
    order: "desc"
  },
  {
    label: "Most recent",
    orderBy: "date-posted",
    order: "desc"
  }
]