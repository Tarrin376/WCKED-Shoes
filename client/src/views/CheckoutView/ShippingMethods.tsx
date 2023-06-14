import { useDeliveryMethods } from "../../hooks/useDeliveryMethods";
import { TDeliveryMethod } from "../../@types/TDeliveryMethod";
import ShippingMethodsLoading from "../../loading/ShippingMethodsLoading";
import { useWindowSize } from "../../hooks/useWindowSize";

interface Props {
  setSelectedMethod: React.Dispatch<React.SetStateAction<TDeliveryMethod | undefined>>
}

const ShippingMethods: React.FC<Props> = ({ setSelectedMethod }) => {
  const deliveryMethods = useDeliveryMethods();
  const windowSize = useWindowSize();

  const updateDeliveryMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!deliveryMethods.methods) {
      return;
    }

    const methodName = e.target.value;
    const methodObj = deliveryMethods.methods.find((deliveryMethod) => deliveryMethod.name === methodName);

    if (methodObj) {
      setSelectedMethod(methodObj);
    }
  }

  return (
    <div>
      <p className="md:text-2xl max-md:text-xl text-main-text-black dark:text-main-text-white pb-3">Shipping Method</p>
      <div className="light-component dark:gray-component flex flex-col justify-between" onChange={updateDeliveryMethod}>
        {deliveryMethods.methods ? deliveryMethods.methods.map((method: TDeliveryMethod, index: number) => {
          return (
            <div className={`${index < deliveryMethods.methods!.length - 1 ? "border-b border-light-border dark:border-main-gray-border" : ""} 
            p-5 flex justify-between items-center`} key={index}>
              <div className="flex gap-5 items-center">
                <input type="radio" value={method.name} name="deliveryMethod" />
                <div>
                  <p className="font-semibold text-main-text-black dark:text-main-text-white">{method.name}</p>
                  <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
                    {method.estimated_lower_days === method.estimated_higher_days ? "Overnight" 
                    : `${method.estimated_lower_days} - ${method.estimated_higher_days} Business Days`}
                  </p>
                  {windowSize <= 360 && 
                  <p className="text-in-stock-green-text dark:text-in-stock-green-text-dark font-semibold">
                  {`£${method.price.toFixed(2)}`}
                </p>}
                </div>
              </div>
              {windowSize > 360 &&
              <p className="text-in-stock-green-text dark:text-in-stock-green-text-dark font-semibold">
                {`£${method.price.toFixed(2)}`}
              </p>}
            </div>
          )
        }) : <ShippingMethodsLoading />}
      </div>
    </div>
  )
};

export default ShippingMethods;