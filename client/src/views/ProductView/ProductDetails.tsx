import { TProduct } from "../../@types/TProduct";
import { useDeliveryMethods } from "../../hooks/useDeliveryMethods";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";

interface Props {
  product: Readonly<TProduct>
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const methods = useDeliveryMethods();

  return (
    <>
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-3 font-semibold">Description</h4>
      <p className="text-side-text-light dark:text-side-text-gray mb-5">{product.description}</p>
      <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-5 font-semibold">Shipping options</h4>
      <div className="flex flex-wrap gap-3 mb-[70px]">
        {methods.deliveryMethods.map((method: TDeliveryMethod, index: number) => {
          return (
            <div className="p-3 py-[7px] light-component dark:gray-component" key={index}>
              <p className="text-main-text-black dark:text-main-text-white font-semibold mb-1">{method.name}</p>
              <p className="text-[15px] text-side-text-light dark:text-side-text-gray">{method.estimated_lower_days === method.estimated_higher_days ? "Overnight" : 
              `${method.estimated_lower_days} - ${method.estimated_higher_days} Business Days`}</p>
              <p className="text-[15px] text-side-text-light mt-[2px] dark:text-side-text-gray font-semibold">{`£${method.price.toFixed(2)}`}</p>
            </div>
          )
        })}
      </div>
    </>
  )
};

export default ProductDetails;