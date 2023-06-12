import OrderedItemLoading from "./OrderedItemLoading";

const orderItemsLimit = 3;

const OrderPlacedLoading = () => {
  return (
    <div className="max-w-screen-xl m-auto">
      <div className="m-auto loading-light dark:loading-dark h-[45px] max-w-[390px]">
      </div>
      <div className="m-auto mt-7 max-w-[700px] mb-2 loading-light dark:loading-dark h-[18px]">
      </div>
      <div className="m-auto max-w-[400px] mb-[70px] loading-light dark:loading-dark h-[18px]">
      </div>
      <div className="mb-7 loading-light h-[38px] dark:loading-dark w-[200px]">
      </div>
      <div className="flex max-lg:flex-col gap-2 justify-between pb-[18px] border-b border-b-light-border dark:border-b-main-gray-border">
        <div className="loading-light dark:loading-dark w-[215px] h-[18px]">
        </div>
        <div className="loading-light dark:loading-dark w-[340px] h-[18px]">
        </div>
      </div>
      <div className="max-h-[600px] overflow-y-scroll">
        {new Array(orderItemsLimit).fill(0).map((_, index) => {
          return <OrderedItemLoading key={index} />
        })}
      </div>
      <div className="mt-5 flex max-lg:flex-col justify-between gap-10 max-lg:gap-4 bg-[#f9f9fa] dark:bg-[#161616] p-5 rounded-[8px]">
        <div className="flex lg:w-[55%] max-lg:w-full gap-10 max-lg:gap-5 max-md:flex-col">
          <div className="w-fit max-lg:w-full">
            <div className="mb-5 loading-light dark:loading-dark w-[70px] h-[23px]">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[190px] mb-2">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[130px]">
            </div>
          </div>
          <div className="flex-grow max-lg:w-full max-lg:pb-[6px] max-lg:text-right max-md:!text-left">
            <div className="mb-5 loading-light dark:loading-dark w-[90px] h-[23px]">
            </div>
            <div className="mb-4 loading-light dark:loading-dark h-[18px] w-[60px]">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] max-w-[220px] mb-2">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] max-w-[250px] mb-2">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] max-w-[180px] mb-5">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[100px] mb-4">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[130px]">
            </div>
          </div>
        </div>
        <div className="flex-grow max-lg:border-t max-lg:border-light-border max-lg:dark:border-t-main-gray-border max-lg:pt-5">
          <div className="mb-5 loading-light dark:loading-dark w-[140px] h-[23px]">
          </div>
          <div className="flex justify-between items-center mb-5">
            <div className="h-[23px] w-[80px] loading-light dark:loading-dark">
            </div>
            <div className="h-[23px] w-[60px] loading-light dark:loading-dark">
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="loading-light dark:loading-dark w-[160px] h-[18px]">
            </div>
            <div className="loading-light dark:loading-dark w-[100px] h-[18px]">
            </div>
          </div>
          <div className="flex justify-between items-center pb-5 border-dashed border-b border-b-light-border dark:border-b-main-gray-border">
          <div className="loading-light dark:loading-dark w-[100px] h-[18px]">
            </div>
            <div className="loading-light dark:loading-dark w-[90px] h-[18px]">
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <div className="h-[23px] w-[60px] loading-light dark:loading-dark">
            </div>
            <div className="h-[23px] w-[80px] loading-light dark:loading-dark">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default OrderPlacedLoading;