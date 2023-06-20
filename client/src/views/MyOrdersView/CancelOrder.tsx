import axios, { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import Button from "../../components/Button";
import { TErrorMessage } from "../../@types/TErrorMessage";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";

interface Props {
  orderID: number,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setHide: React.Dispatch<React.SetStateAction<boolean>>,
}

const CancelOrder: React.FC<Props> = ({ orderID, setDisabled, setHide }) => {
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const cancelOrder = async (): Promise<TErrorMessage | undefined> => {
    try {
      setDisabled(true);
      await axios.delete<string>(`${process.env.REACT_APP_API_URL}/api/users/cancel-order/${orderID}`, { withCredentials: true });
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const filterOutOrder = () => {
    setHide(true);
    setDisabled(false);
  }

  return (
    <div className="p-2 mt-3 mb-3 pb-0">
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