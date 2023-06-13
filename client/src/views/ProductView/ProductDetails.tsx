import { TProduct } from "../../@types/TProduct";
import { useDeliveryMethods } from "../../hooks/useDeliveryMethods";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import DPDLightIcon from "../../assets/dpd-light.png";
import DPDDarkIcon from "../../assets/dpd-dark.png";
import { ThemeContext } from "../../providers/ThemeProvider";
import { useContext } from "react";

interface Props {
  product: Readonly<TProduct>
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const deliveryMethods = useDeliveryMethods();
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-5 font-semibold">Description</h4>
      <p className="text-side-text-light dark:text-side-text-gray mb-7">{product.description}</p>
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-5 font-semibold">Shipping options</h4>
      <div className="flex flex-wrap mb-[34px] gap-6">
        {deliveryMethods.methods ? deliveryMethods.methods.map((method: TDeliveryMethod, index: number) => {
          return (
            <div className="pl-6 py-[6px] border-l border-light-border dark:border-main-gray-border relative" key={index}>
              <p className="text-main-text-black dark:text-main-text-white font-semibold mb-1">
                {method.name}
              </p>
              <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
                {method.estimated_lower_days === method.estimated_higher_days ? "Overnight" : 
                `${method.estimated_lower_days} - ${method.estimated_higher_days} Business Days`}
              </p>
              <p className="font-semibold text-in-stock-green-text mt-[2px] dark:text-in-stock-green-text-dark">
                {`£${method.price.toFixed(2)}`}
              </p>
              <img src={themeContext?.darkMode ? DPDDarkIcon : DPDLightIcon} 
              className="w-[25px] h-[25px] absolute top-[7px] left-[-13px] bg-bg-light dark:bg-bg-dark p-[4px]" 
              alt="" />
            </div>
          )
        }) : <ShippingOptionsLoading />}
      </div>
    </>
  )
};

const ShippingOptionsLoading = () => {
  const shippingOptionsLimit = 3;
  const themeContext = useContext(ThemeContext);

  return (
    <>
      {new Array(shippingOptionsLimit).fill(0).map((_, index: number) => {
        return (
          <div className="pl-6 py-[6px] border-l border-light-border dark:border-main-gray-border relative" key={index}>
            <div className="mb-3 loading-light dark:loading-dark h-[18px] w-[160px]">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[140px] mb-3">
            </div>
            <div className="loading-light dark:loading-dark h-[18px] w-[60px]">
            </div>
            <img src={themeContext?.darkMode ? DPDDarkIcon : DPDLightIcon} 
            className="w-[25px] h-[25px] absolute top-[7px] left-[-13px] bg-bg-light dark:bg-bg-dark p-[4px]" 
            alt="" />
          </div>
        )
      })}
    </>
  )
};

export default ProductDetails;