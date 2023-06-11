import axios, { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import Button from "../../components/Button";
import { TErrorMessage } from "../../@types/TErrorMessage";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { TOrderData } from "../../@types/TOrderData";

interface Props {
  orderID: number,
  setNext: React.Dispatch<React.SetStateAction<TOrderData[]>>
}

const CancelOrder: React.FC<Props> = ({ orderID, setNext }) => {
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const cancelOrder = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.delete<string>(`/users/cancel-order/${orderID}`);
      return undefined;
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const filterOutOrder = () => {
    setNext((cur: TOrderData[]) => cur.filter((order: TOrderData) => order.order_details.id !== orderID));
  }

  return (
    <div className="p-3 mt-3 mb-3 pb-0">
      <h4 className="text-[19px] mb-3 font-semibold">Cancel Order</h4>
      <p className="text-main-text-black dark:text-main-text-white mb-2">
        Do you wish to cancel your order?
      </p>
      <p className="text-side-text-light dark:text-side-text-gray max-w-[330px] mb-5">
        Note: Refunds may take up to 5-7 business days to reflect on your account.
      </p>
      <Button 
        action={cancelOrder} 
        completedText="Order cancelled" 
        defaultText="Yes, cancel my order" 
        loadingText="Cancelling order" 
        styles="danger-btn"
        setErrorMessage={setErrorMessage}
        whenComplete={filterOutOrder}
      />
      {errorMessage && <ErrorMessage error={errorMessage.message} />}
    </div>
  )
};

export default CancelOrder;