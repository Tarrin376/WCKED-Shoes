import OrderedItemLoading from "./OrderedItemLoading";
import { useWindowSize } from "../hooks/useWindowSize";

interface Props {
  styles?: string,
}

const orderItemsLimit = 1;

const OrderCardLoading: React.FC<Props> = ({ styles }) => {
  const windowSize = useWindowSize();

  return (
    <div className={`light-component dark:gray-component overflow-hidden ${styles}`}>
      <div className="bg-[#f5f5f7] dark:bg-[#171717] p-4 flex justify-between items-center">
        <div className={`flex flex-grow ${windowSize >= 400 ? "gap-10" : "justify-between"}`}>
          <div>
            <div className="font-semibold loading-light dark:loading-dark w-[100px] h-[18px]"></div>
            <div className="w-[55px] h-[18px] loading-light dark:loading-dark mt-2"></div>
          </div>
          <div>
            <div className={`font-semibold loading-light dark:loading-dark w-[55px] h-[18px] ${windowSize >= 400 ? "" : "ml-auto"}`}></div>
            <div className="w-[100px] h-[18px] loading-light dark:loading-dark mt-2"></div>
          </div>
        </div>
        {windowSize >= 400 &&
        <div className="flex gap-10">
          <div>
            <div className="font-semibold loading-light dark:loading-dark w-[65px] h-[18px] ml-auto"></div>
            <div className="w-[40px] h-[18px] loading-light dark:loading-dark mt-2 ml-auto"></div>
          </div>
        </div>}
      </div>
      <div className={`p-4 flex flex-col`}>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="w-full h-[30px] loading-light dark:loading-dark"></div>
          </div> 
          <div className="mt-4 max-w-[400px] h-[18px] loading-light dark:loading-dark"></div>
          <div className="max-w-[220px] h-[18px] loading-light dark:loading-dark mt-[9px]"></div>
        </div>
        <div className="flex-grow overflow-y-scroll bg-[#f9f9fa] dark:bg-[#181818] p-3 max-lg:py-0 rounded-[8px] max-h-[400px]">
          {new Array(orderItemsLimit).fill(0).map((_, index) => {
            return (
              <OrderedItemLoading 
                isFirst={index === 0} 
                noBorder={index === orderItemsLimit - 1}
                key={index} 
                styles={"!py-3 max-lg:!py-0"}
              />
            )
          })}
        </div>
        <div className="mt-5 flex max-md:flex-col-reverse gap-3">
          <div className="w-[120px] max-md:w-full h-[37px] loading-light dark:loading-dark"></div>
          <div className="flex gap-3 max-xs:flex-col">
            <div className="w-[140px] max-sm:w-full h-[37px] flex-grow loading-light dark:loading-dark"></div>
            <div className="w-[140px] max-sm:w-full h-[37px] flex-grow loading-light dark:loading-dark"></div>
          </div>
        </div>
        </div>
    </div>
  )
};

export default OrderCardLoading;