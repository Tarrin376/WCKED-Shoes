import { TErrorMessage } from "../@types/TErrorMessage";

interface Props {
  styles?: string,
  smallSize?: boolean,
  errorMessage?: TErrorMessage
}

const ProductCardLoading: React.FC<Props> = ({ styles, smallSize, errorMessage }) => {
  return (
    <div className={`dark:gray-component light-component !bg-transparent border-none !shadow-none
    ${styles} ${smallSize ? "w-[200px]" : "w-[265px]"}`}>
      <div className={`w-full rounded-[8px] bg-center bg-cover flex items-center justify-center p-3 
      ${errorMessage && errorMessage.message ? "!bg-main-red" : "dark:loading-dark loading-light"} 
      ${smallSize ? "h-[200px]" : "h-[265px]"}`}>
        {errorMessage && errorMessage.message && 
        <p className="text-main-text-white text-center text-[17px] font-semibold whitespace-pre-wrap">
          {errorMessage.message}
        </p>}
      </div>
      <div className="border-b border-light-border dark:border-main-gray-border pb-4">
        <div className="mt-5 w-full h-[20px] dark:loading-dark loading-light">
        </div>
        <div className={`flex ${smallSize ? "flex-col items-start mt-4 gap-[9px]" : "items-center justify-between mt-[14px]"}`}>
          <div className="w-[120px] h-[18px] dark:loading-dark loading-light"></div>
          <div className="w-[90px] h-[18px] dark:loading-dark loading-light"></div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="w-[100px] h-[18px] dark:loading-dark loading-light"></div>
        <div className="w-[60px] h-[18px] dark:loading-dark loading-light"></div>
      </div>
    </div>
  )
};

export default ProductCardLoading;