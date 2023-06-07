
export const CheckoutItemsLoading = () => {
  const cartSize = 4;

  return (
    <div className="h-[891px] overflow-y-scroll pr-5">
      {new Array(cartSize).fill(0).map((_, index) => {
        return (
          <div className={`md:pb-5 max-md:pb-[8px] ${index === 0 ? "" : "pt-5"} border-b border-b-light-border 
          dark:border-b-main-gray-border flex gap-7 items-center`} key={index}>
            <div className="w-[110px] h-[110px] max-md:hidden bg-cover bg-center rounded-[8px] loading-light dark:loading-dark">
            </div>
            <div className="flex-grow pt-1 pb-2">
              <div className="text-main-text-black dark:text-main-text-white text-[18px] h-[20px] loading-light dark:loading-dark"></div>
              <div className="mt-[14px] h-[15px] loading-light dark:loading-dark max-w-[170px]"></div>
              <div className="mt-[8px] h-[15px] loading-light dark:loading-dark max-w-[190px]"></div>
              <div className="mt-[8px] h-[15px] loading-light dark:loading-dark max-w-[154px]"></div>
            </div>
          </div>
        )
      })}
    </div>
  )
};

export default CheckoutItemsLoading;
