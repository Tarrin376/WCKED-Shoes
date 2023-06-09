import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import ErrorMessage from "./ErrorMessage";

interface Props {
  setVerifyEmailPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  setSignUpPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  emailAddress: string,
  password: string
}

const VerifyEmail: React.FC<Props> = ({ setVerifyEmailPopUp, setSignUpPopUp, emailAddress, password }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [secretCode, setSecretCode] = useState<string>("d");
  const [toggleSecretCode, setToggleSecretCode] = useState<boolean>(false);
  const [inputIndex, setInputIndex] = useState<number>(0);

  const sendVerificationCode = useCallback(async () => {
    try {
      const verificationCode = await axios.post<string>(`/users/send-code`, { email: emailAddress });
      setSecretCode(verificationCode.data);
      setErrorMessage("");
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          setErrorMessage("Error, too many requests. You must wait 1 minute before trying again.")
        } else {
          setErrorMessage(error.response?.data);
        }
      }
    }
  }, [emailAddress]);

  useEffect(() => {
    sendVerificationCode();
  }, [sendVerificationCode]);

  const checkVerificationCode = async ()  => {
    const codeInput = code.join('');

    try {
      const verified = await axios.post<string>(`/users/verify-email`, { 
        code: codeInput,
        email: emailAddress 
      });
      
      if (verified.status === 200) {
        createAccount();
      } else {
        setErrorMessage(verified.data);
      }
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error!.response!.data);
      } else {
        setErrorMessage(error.message);
      }
    }
  }

  const createAccount = async () => {
    try {
      await axios.post<string>("/users/register", {
        email: emailAddress,
        password: password
      });
  
      setVerifyEmailPopUp(false);
      setErrorMessage("");
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error!.response!.data);
      } else {
        setErrorMessage(error.message);
      }
    }
  }

  const toggleSecretCodeHandler = () => {
    setToggleSecretCode((cur) => !cur);
  }

  return (
    <PopUpWrapper setPopUp={setVerifyEmailPopUp}>
      <h4 className="text-2xl mb-2">Please check your email</h4>
      <p className="text-side-text-light dark:text-side-text-gray text-lg mb-1">
        We've just sent a code to
        <span className="font-semibold">
          {` ${emailAddress}`}
        </span>
      </p>
      <button className={`text-bg-primary-btn-hover ${toggleSecretCode ? "mb-1" : "mb-6"} underline`} onClick={toggleSecretCodeHandler}>
        Psst! Want to know a secret?
      </button>
      {toggleSecretCode && 
      <p className="text-main-text-black mb-6 dark:text-main-text-white">
        Code:
        <span className="text-in-stock-green-text dark:text-in-stock-green-text-dark">
          {` ${secretCode}`}
        </span>
      </p>}
      <div className="flex justify-between">
        {code.map((item, index) => {
          return (
            <input type="text" key={index} value={item} maxLength={1} 
            className="w-[85px] h-[85px] text-[45px] text-center text-box-light dark:text-box" onChange={(e) => {
              const val = e.target.value;
              const num = val !== "" ? parseInt(val) : 0;
              if (!isNaN(num) || val === "") {
                setCode([...code.slice(0, index), val, ...code.slice(index + 1)]);
              }
            }} />
          )
        })}
      </div>
      <p className="mt-3 text-center text-side-text-light dark:text-side-text-gray text-[15px]">
        Didn't get a code?
        <span className="font-semibold text-main-text-black dark:text-main-text-white underline cursor-pointer ml-2" onClick={sendVerificationCode}>
          Click to resend.
        </span>
      </p>
      {errorMessage.length > 0 && <ErrorMessage error={errorMessage} />}
      <div className="flex gap-4 mt-7">
        <button className="btn text-main-text-black dark:text-main-text-white border border-main-text-black 
          dark:border-search-border bg-transparent w-1/2 h-[47px]
          dark:hover:bg-[#2B2B2B] hover:bg-main-text-black hover:text-main-text-white text-[15px]" onClick={() => {
            setVerifyEmailPopUp(false);
            setSignUpPopUp(true);
          }}>Cancel</button>
        <button className="btn-primary w-1/2 h-[47px] text-base" onClick={checkVerificationCode}>
          Verify
        </button>
      </div>
    </PopUpWrapper>
  )
};

export default VerifyEmail;