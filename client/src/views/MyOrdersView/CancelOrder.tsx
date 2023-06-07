import axios, { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";

interface Props {
  orderID: number
}

const CancelOrder: React.FC<Props> = ({ orderID }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const cancelOrder = async () => {
    try {
      const response = await axios.delete<string>(`/users/cancel-order/${orderID}`);
      setSuccessMessage(response.data);
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response!.data);
      } else {
        setErrorMessage(error.message);
      }

      setTimeout(() => setErrorMessage(""), 5000);
    }
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
      <button className="bg-main-red hover:bg-main-red-hover px-4 h-[37px] text-main-text-white btn"
      onClick={cancelOrder}>
        Yes, cancel my order
      </button>
      {errorMessage !== "" && successMessage === "" && <ErrorMessage error={errorMessage} />}
      {successMessage !== "" && <ErrorMessage error={successMessage} styles="!bg-[#1cad21]" />}
    </div>
  )
};

export default CancelOrder;