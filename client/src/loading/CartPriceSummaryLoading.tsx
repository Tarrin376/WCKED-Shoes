
interface Props {
  styles?: string
}

export const CartPriceSummaryLoading: React.FC<Props> = ({ styles }) => {
  return (
    <div className={styles}>
      <div className="mt-6 flex justify-between">
        <div className="h-[18px] w-[80px] loading-light dark:loading-dark"></div>
        <div className="h-[18px] w-[90px] loading-light dark:loading-dark"></div>
      </div>
      <div className="mt-3 flex justify-between border-b border-b-light-border dark:border-b-main-gray-border pb-6">
      <div className="h-[18px] w-[95px] loading-light dark:loading-dark"></div>
        <div className="h-[18px] w-[70px] loading-light dark:loading-dark"></div>
      </div>
      <div className="mt-7 flex justify-between">
        <div className="text-[21px] h-[23px] w-[100px] loading-light dark:loading-dark"></div>
        <div className="text-[21px] h-[23px] w-[120px] loading-light dark:loading-dark"></div>
      </div>
    </div>
  )
};

export default CartPriceSummaryLoading;