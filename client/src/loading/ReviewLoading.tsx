
const ReviewLoading = () => {
  return (
    <div className="border-b border-light-border dark:border-main-gray-border pb-6">
      <div className="flex items-center gap-4">
        <div className="w-[210px] h-[15px] dark:loading-dark loading-light"></div>
        <p className="w-[150px] h-[15px] dark:loading-dark loading-light"></p>
      </div>
      <div className="w-[110px] h-[14px] dark:loading-dark loading-light mt-2"></div>
      <div className="w-full h-[14px] dark:loading-dark loading-light mt-4"></div>
      <div className="w-[80%] h-[14px] dark:loading-dark loading-light mt-2"></div>
      <div className="w-[84%] h-[14px] dark:loading-dark loading-light mt-2"></div>
      <div className="w-[80px] h-[30px] dark:loading-dark loading-light mt-4"></div>
    </div>
  )
};

export default ReviewLoading;