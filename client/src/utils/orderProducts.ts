import { TOrderByOption } from "../@types/TOrderByOption";
import { TProductOptions } from "../@types/TProductOptions";

export const orderProducts: readonly TOrderByOption<TProductOptions>[] = [
  {
    label: 'Most Popular',
    orderBy: 'popularity',
    order: 'desc'
  },
  {
    label: 'Highest rating',
    orderBy: 'rating',
    order: 'desc'
  },
  {
    label: 'Lowest Price',
    orderBy: 'price',
    order: 'asc'
  },
  {
    label: 'Lowest Carbon Footprint',
    orderBy: 'carbon-footprint',
    order: 'asc'
  },
  {
    label: 'Highest Price',
    orderBy: 'price',
    order: 'desc'
  },
  {
    label: 'Highest Carbon Footprint',
    orderBy: 'carbon-footprint',
    order: 'desc'
  },
  {
    label: 'Least Popular',
    orderBy: 'popularity',
    order: 'asc'
  },
  {
    label: 'Lowest rating',
    orderBy: 'rating',
    order: 'asc'
  }
]