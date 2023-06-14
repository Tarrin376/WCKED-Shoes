import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import ErrorMessage from "./ErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";

interface Props {
  setVerifyEmailPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  setSignUpPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  emailAddress: string,
  password: string
}

const VerifyEmail: React.FC<Props> = ({ setVerifyEmailPopUp, setSignUpPopUp, emailAddress, password }) => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const [secretCode, setSecretCode] = useState<string>("");
  const [toggleSecretCode, setToggleSecretCode] = useState<boolean>(false);

  const sendVerificationCode = useCallback(async () => {
    try {
      const verificationCode = await axios.post<string>("/api/users/send-code", { email: emailAddress });
      setSecretCode(verificationCode.data);
      setErrorMessage(undefined);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      setErrorMessage(errorMsg);
    }
  }, [emailAddress]);

  useEffect(() => {
    sendVerificationCode();
  }, [sendVerificationCode]);

  const checkVerificationCode = async (): Promise<TErrorMessage | undefined> => {
    const codeInput = code.join('');

    try {
      await axios.post<string>("/api/users/verify-email", { 
        code: codeInput,
        email: emailAddress 
      });
      
      return createAccount();
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const createAccount = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.post<string>("/api/users/register", {
        email: emailAddress,
        password: password
      });
  
      setErrorMessage(undefined);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const toggleSecretCodeHandler = () => {
    setToggleSecretCode((cur) => !cur);
  }

  const backToSignUp = () => {
    setVerifyEmailPopUp(false);
    setSignUpPopUp(true);
  }

  const closeVerifyEmailPopUp = () => {
    setVerifyEmailPopUp(false);
  }

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    const num = val !== "" ? parseInt(val) : 0;
    if (!isNaN(num) || val === "") {
      setCode([...code.slice(0, index), val, ...code.slice(index + 1)]);
    }
  }

  return (
    <PopUpWrapper setPopUp={setVerifyEmailPopUp}>
      <h4 className="text-2xl mb-2">Please check your email</h4>
      <p className="text-side-text-light dark:text-side-text-gray text-lg mb-4">
        We've just sent a code to
        <span className="font-semibold">
          {` ${emailAddress}`}
        </span>
      </p>
      {secretCode !== "" &&
      <>
        <button className={`text-bg-primary-btn-hover ${toggleSecretCode ? "mb-1" : "mb-[26px]"} underline`} onClick={toggleSecretCodeHandler}>
          Psst! Want to know a secret?
        </button>
        {toggleSecretCode && 
        <p className="text-main-text-black mb-[26px] dark:text-main-text-white">
          Code:
          <span className="text-in-stock-green-text dark:text-in-stock-green-text-dark">
            {` ${secretCode}`}
          </span>
        </p>}
      </>}
      <div className="flex justify-between">
        {code.map((item, index) => {
          return (
            <input type="text" key={index} value={item} maxLength={1} 
            className="w-[85px] h-[85px] text-[45px] text-center text-box-light dark:text-box" 
            onChange={(e) => updateCode(e, index)} />
          )
        })}
      </div>
      <p className="mt-3 text-center text-side-text-light dark:text-side-text-gray text-[15px]">
        Didn't get a code?
        <span className="font-semibold text-main-text-black dark:text-main-text-white underline cursor-pointer ml-2 
        hover:!text-bg-primary-btn-hover btn" onClick={sendVerificationCode}>
          Click to resend.
        </span>
      </p>
      {errorMessage && <ErrorMessage error={errorMessage.message} />}
      <div className="flex gap-4 mt-7">
        <button className="login-btn w-1/2" onClick={backToSignUp}>
          Back
        </button>
        <Button
          action={checkVerificationCode}
          completedText="Account created"
          defaultText="Verify"
          loadingText="Verifying email"
          styles="btn-primary w-1/2 h-[47px] text-base"
          setErrorMessage={setErrorMessage}
          whenComplete={closeVerifyEmailPopUp}
        />
      </div>
    </PopUpWrapper>
  )
};

export default VerifyEmail;