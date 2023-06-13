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
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-2 font-semibold">Description</h4>
      <p className="text-side-text-light dark:text-side-text-gray mb-5">{product.description}</p>
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-[14px] font-semibold">Shipping options</h4>
      <div className="flex flex-wrap mb-[34px]">
        {deliveryMethods.methods && deliveryMethods.methods.map((method: TDeliveryMethod, index: number) => {
          return (
            <div className="px-6 py-[6px] border-l border-light-border dark:border-main-gray-border relative" key={index}>
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
        })}
      </div>
    </>
  )
};

export default ProductDetails;