
interface Props {
  isFirst?: boolean,
  noBorder?: boolean,
  styles?: string
}

const OrderedItemLoading: React.FC<Props> = ({ isFirst, noBorder, styles }) => {
  return (
    <div className={`lg:py-5 max-lg:py-2 ${styles} border-b border-b-light-border dark:border-b-main-gray-border flex lg:gap-7 
    max-lg:gap-2 items-center ${isFirst ? "!pt-0" : ""} ${noBorder ? "!pb-0 !border-none" : ""}`}>
      <div className="w-[120px] h-[120px] max-lg:hidden bg-cover bg-center rounded-[8px] loading-light dark:loading-dark">
      </div>
      <div className="pt-2 pb-2">
        <div className="w-[160px] h-[18px] loading-light dark:loading-dark"></div>
        <div className="w-[130px] h-[18px] loading-light dark:loading-dark mt-2"></div>
        <div className="w-[80px] h-[18px] loading-light dark:loading-dark md:hidden mt-2"></div>
      </div>
      <div className="flex items-center justify-end lg:gap-[150px] max-lg:gap-[70px] flex-grow">
        <div className="w-[80px] h-[18px] loading-light dark:loading-dark max-md:hidden"></div>
        <div className="w-[70px] h-[18px] loading-light dark:loading-dark"></div>
      </div>
    </div>
  )
};

export default OrderedItemLoading;