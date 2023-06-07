
const ProductCardLoading = () => {
  return (
    <div className="dark:gray-component light-component !bg-transparent border-none !shadow-none w-[265px]">
      <div className="w-full h-[265px] rounded-[8px] relative bg-center bg-cover dark:loading-dark loading-light"></div>
      <div className="border-b border-light-border dark:border-[#6f6f6f63] pb-4">
        <div className="mt-5 w-full h-[20px] dark:loading-dark loading-light">
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="w-[120px] h-[18px] dark:loading-dark loading-light"></div>
          <div className="w-[90px] h-[18px] dark:loading-dark loading-light"></div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="w-[70px] h-[18px] dark:loading-dark loading-light"></div>
        <div className="w-[130px] h-[18px] dark:loading-dark loading-light"></div>
      </div>
    </div>
  )
};

export default ProductCardLoading;