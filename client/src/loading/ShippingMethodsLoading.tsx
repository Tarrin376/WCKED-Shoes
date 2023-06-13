import { useWindowSize } from "../hooks/useWindowSize";

const shippingMethodLimit = 3;

const ShippingMethodsLoading = () => {
  const windowSize = useWindowSize();

  return (
    <>
    {new Array(shippingMethodLimit).fill(0).map((_, index) => {
      return (
        <div className={`${index < shippingMethodLimit - 1 ? "border-b border-light-border dark:border-main-gray-border" : ""} 
        p-5 flex items-center justify-between`}>
          <div className="flex gap-3 items-center">
            <input type="radio" disabled name="deliveryMethod" />
            <div>
              <div className="loading-light dark:loading-dark h-[18px] w-[160px] mb-2">
              </div>
              <div className="loading-light dark:loading-dark h-[18px] w-[140px]">
              </div>
              {windowSize <= 360 && 
              <div className="loading-light dark:loading-dark h-[18px] w-[60px] mt-2">
              </div>}
            </div>
          </div>
          {windowSize > 360 && 
          <div className="loading-light dark:loading-dark h-[18px] w-[60px]">
          </div>}
        </div>
      )
    })}
    </>
  )
};

export default ShippingMethodsLoading;