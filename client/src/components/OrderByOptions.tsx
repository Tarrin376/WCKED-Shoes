import { TOrderByOption } from "../@types/TOrderByOption";
import { TReviewOptions } from "../@types/TReviewOptions";
import { TProductOptions } from "../@types/TProductOptions";

interface Props<T> {
  options: readonly TOrderByOption<T>[],
  handleSort: (index: number) => void
  styles?: string
}

const OrderByOptions = <T extends TReviewOptions | TProductOptions>(props: Props<T>) => {
  return (
    <select className={props.styles} onChange={(e) => props.handleSort(e.currentTarget.selectedIndex)}>
      {props.options.map((cur: TOrderByOption<T>) => {
        return (
          <option key={cur.label} value={cur.label}>
            {cur.label}
          </option>
        );
      })}
    </select>
  )
};

export default OrderByOptions;
