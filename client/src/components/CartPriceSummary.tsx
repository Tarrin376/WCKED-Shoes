
interface Props {
  subtotal: number,
  shipping?: number,
  styles?: string,
  discount: number
}

const CartPriceSummary: React.FC<Props> = ({ subtotal, shipping, styles, discount }) => {
  return (
    <div className={styles}>
      <div className="flex justify-between">
        <h3 className="text-side-text-light dark:text-side-text-gray">Subtotal</h3>
        <p className="text-main-text-black dark:text-main-text-white">{`£${subtotal.toFixed(2)}`}</p>
      </div>
      {discount > 0 &&
      <div className="mt-2 flex justify-between">
        <h3 className="text-side-text-light dark:text-side-text-gray">Discount</h3>
        <p className="text-main-text-black dark:text-main-text-white">{`-£${discount.toFixed(2)}`}</p>
      </div>}
      <div className="mt-2 flex justify-between border-b border-b-light-border dark:border-b-main-gray-border pb-6">
        <h3 className="text-side-text-light dark:text-side-text-gray">Shipping</h3>
        <p className="text-main-text-black dark:text-main-text-white">{!shipping ? "TBC at checkout" : `£${shipping.toFixed(2)}`}</p>
      </div>
      <div className="mt-6 flex justify-between text-main-text-black dark:text-main-text-white">
        <h3 className="text-[21px] max-sm:text-[19px]">Total</h3>
        <p className="text-[21px] font-semibold max-sm:text-[19px]">{`£${(subtotal + (!shipping ? 0 : shipping) - discount).toFixed(2)}`}</p>
      </div>
    </div>
  )
};

export default CartPriceSummary;