
interface Props {
  styles?: string,
  smallSize?: boolean
}

const ProductCardLoading: React.FC<Props> = ({ styles, smallSize }) => {
  return (
    <div className={`dark:gray-component light-component !bg-transparent border-none !shadow-none
    ${styles} ${smallSize ? "w-[220px]" : "w-[265px]"}`}>
      <div className={`w-full rounded-[8px] relative bg-center bg-cover dark:loading-dark loading-light 
      ${smallSize ? "h-[220px]" : "h-[265px]"}`}>
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
        <div className="w-[70px] h-[18px] dark:loading-dark loading-light"></div>
        <div className="w-[130px] h-[18px] dark:loading-dark loading-light"></div>
      </div>
    </div>
  )
};

export default ProductCardLoading;