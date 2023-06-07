
import { TOrderOptions } from "../@types/TOrderOptions";
import { TOrderByOption } from "../@types/TOrderByOption";

export const orderOrders: readonly TOrderByOption<TOrderOptions>[] = [
  {
    label: "Most recent",
    orderBy: 'date',
    order: 'desc'
  }
]