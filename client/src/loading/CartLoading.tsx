import CartPriceSummaryLoading from "./CartPriceSummaryLoading";

export const CartLoading = () => {
  return (
    <>
      <div className="mb-6 loading-light dark:loading-dark h-[33px] max-w-[320px]">
      </div>
      <CartItemLoading />
      <CartPriceSummaryLoading />
      <div className="block mt-7 h-[45px] w-[180px] loading-light dark:loading-dark mb-[70px]">
      </div>
    </>
  )
};

const CartItemLoading = () => {
  const cartSize = 4;

  return (
    <>
    {new Array(cartSize).fill(0).map((_, index) => {
      return (
        <div className="py-5 border-b border-b-light-border dark:border-b-main-gray-border flex gap-7 items-center" key={index}>
          <div className="w-[160px] h-[160px] max-md:hidden loading-light dark:loading-dark rounded-[8px]">
          </div>
          <div className="flex-grow pt-1">
            <div className={`h-[23px] loading-light dark:loading-dark max-w-[500px]`}></div>
            <div className="mt-[14px] h-[15px] loading-light dark:loading-dark max-w-[170px]"></div>
            <div className="mt-[8px] h-[15px] loading-light dark:loading-dark max-w-[190px]"></div>
            <div className="mt-[8px] h-[15px] loading-light dark:loading-dark max-w-[154px]"></div>
            <div className="mt-[14px] flex justify-between items-center">
              <div className="flex gap-3">
                <div className="loading-light dark:loading-dark rounded-[5px] px-2 w-[60px] h-[30px] flex items-center justify-center">
                </div>
                <div className="loading-light dark:loading-dark rounded-[5px] w-[75px] px-2 h-[30px] cursor-pointer text-main-white">
                </div>
              </div>
              <div className="w-[80px] h-[30px] loading-light dark:loading-dark rounded-[5px]">
              </div>
            </div>
          </div>
        </div>
      )
    })}
    </>
  )
}

export default CartLoading;