
const ProductLoading = () => {
  return (
    <>
      <div className="mb-[40px] h-7 max-w-[350px] loading-light dark:loading-dark">
      </div>
      <div className="flex max-xl:flex-col w-full gap-7 mb-[40px]">
        <div className="flex max-2xl:flex-col-reverse items-center xl:w-2/3 max-xl:w-full gap-6">
          <ProductImagesLoading />
          <div className="w-full h-[540px] max-xl:h-[600px] max-lg:h-[400px] max-md:h-[300px] max-sm:h-[245px] bg-center bg-cover rounded-[8px] relative 
          shadow-light-component-shadow dark:shadow-gray-component-shadow loading-light dark:loading-dark">
          </div>
        </div>
        <div className="w-1/3 max-xl:w-full xl:h-[540px] bg-transparent xl:px-6">
          <div className="mb-[12px] loading-light dark:loading-dark h-[36px]"></div>
          <div className="mb-6 loading-light dark:loading-dark h-[36px] w-[50%]"></div>
          <div className="flex items-center gap-3 text-side-text-light dark:text-side-text-gray w-fit justify-between mb-6">
            <p className="text-[15px] h-[16px] loading-light dark:loading-dark w-[70px]"></p>
            <div className="w-[1px] h-[15px] bg-light-border dark:bg-line-gray"></div>
            <p className="text-[15px] h-[16px] loading-light dark:loading-dark w-[70px]"></p>
            <div className="w-[1px] h-[15px] bg-light-border dark:bg-line-gray"></div>
            <p className="text-[15px] h-[16px] loading-light dark:loading-dark w-[70px]"></p>
          </div>
          <p className="loading-light dark:loading-dark h-[30px] w-[200px] mb-6"></p>
          <ProductSizesLoading />
          <div className="h-[48px] w-[180px] mt-7 loading-light dark:loading-dark"></div>
        </div>
      </div>
      <div className="text-main-text-black dark:text-main-text-white text-[19px] mb-8 loading-light dark:loading-dark max-w-[300px] h-[27px] font-semibold"></div>
      <div className="mb-[14px] loading-light dark:loading-dark h-[17px] w-[97%]"></div>
      <div className="mb-[14px] loading-light dark:loading-dark h-[17px] w-[97%]"></div>
      <div className="mb-[14px] loading-light dark:loading-dark h-[17px] w-[95%]"></div>
      <div className="mb-[14px] loading-light dark:loading-dark h-[17px] w-[93%]"></div>
    </>
  )
};

const ProductSizesLoading = () => {
  const sizes = 6;

  return (
    <div className="flex flex-wrap gap-[11px] mb-7">
      {new Array(sizes).fill(0).map((_, index) => {
        return (
          <div className="w-[70px] h-[30px] rounded-md loading-light dark:loading-dark" key={index}>
          </div>
        )
      })}
    </div>
  )
};

const ProductImagesLoading = () => {
  const images = 5;

  return (
    <div className="max-2xl:whitespace-nowrap max-2xl:w-full 2xl:h-[540px] 2xl:w-[205px] 
    max-2xl:h-fit max-2xl:pb-4 2xl:overflow-y-scroll max-2xl:overflow-x-scroll max-2xl:overflow-y-hidden max-lg:hidden">
      {new Array(images).fill(0).map((_, index) => {
        return (
          <div className={`w-[127px] h-[127px] rounded-[8px] bg-center bg-cover max-2xl:inline-block loading-light dark:loading-dark
          ${index > 0 ? "2xl:mt-6" : ""} ${index < images - 1 ? "max-2xl:mr-6" : ""}`} 
          key={index}>
          </div>
        )
      })}
    </div>
  )
};

export default ProductLoading;