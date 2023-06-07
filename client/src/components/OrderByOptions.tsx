import { TOrderByOption } from "../@types/TOrderByOption";
import { TReviewOptions } from "../@types/TReviewOptions";
import { TProductOptions } from "../@types/TProductOptions";

interface Props<T> {
  options: readonly TOrderByOption<T>[],
}

const OrderByOptions = <T extends TReviewOptions | TProductOptions>(props: Props<T>) => {
  return (
    <>
      {props.options.map((cur: TOrderByOption<T>) => {
        return (
          <option key={cur.label} value={cur.label}>
            {cur.label}
          </option>
        );
      })}
    </>
  )
};

export default OrderByOptions;
