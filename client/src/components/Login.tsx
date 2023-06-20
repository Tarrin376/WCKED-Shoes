import PopUpWrapper from "../wrappers/PopUpWrapper";
import { checkEmailAddress, checkPassword, checkEmailAndPass } from "../utils/checkEmailAndPass";
import axios, { AxiosError } from "axios";
import { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../providers/UserProvider";
import { TUser } from "../@types/TUser";
import { TErrorMessage } from "../@types/TErrorMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { useWindowSize } from "../hooks/useWindowSize";
import Button from "./Button";

interface Props {
  setLoginPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  openSignUpPopUp: () => void,
  emailAddress: string
  setEmailAddress: React.Dispatch<React.SetStateAction<string>>,
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
}

const Login: React.FC<Props> = (props) => {
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();
  const userContext = useContext(UserContext);
  const [rememberMe, setRememberMe] = useState(false);
  const windowSize = useWindowSize();
  const [email, setEmail] = useState<string>("");

  const loginUser = async (): Promise<TErrorMessage | undefined> => {
    try {
      const loginResponse = await axios.post<TUser>("/api/users/login", {
        email: props.emailAddress,
        password: props.password,
        remember_me: rememberMe
      });

      setEmail(loginResponse.data.email);
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const updateRememberMe = () => {
    setRememberMe((cur) => !cur);
  }

  const openSignUpPopUp = () => {
    props.setLoginPopUp(false);
    props.openSignUpPopUp();
  }

  const updateUserData = () => {
    props.setLoginPopUp(false);
      userContext?.setUserData((cur) => {
        return {
          ...cur,
          email: email,
        }
      });

      props.setEmailAddress("");
      props.setPassword("");
  }

  return (
    <PopUpWrapper setPopUp={props.setLoginPopUp} star={true}>
      <h1 className="text-main-text-black dark:text-main-text-white text-2xl mb-6">Log in</h1>
      {errorMessage && <ErrorMessage error={errorMessage.message} styles="mb-6" />}
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="email" className="font-semibold">Email address</label>
        <input type="email" className={`text-box-light dark:text-box h-[45px] ${!checkEmailAddress(props.emailAddress) ? 'text-box-error-focus' : ''}`} 
        value={props.emailAddress} onChange={(e) => props.setEmailAddress(e.target.value)} id="email" placeholder="Enter email address" />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="email" className="font-semibold">Password</label>
        <input type="password" className={`text-box-light dark:text-box h-[45px] ${!checkPassword(props.password) ? 'text-box-error-focus' : ''}`} 
        value={props.password} onChange={(e) => props.setPassword(e.target.value)} 
        id="password" placeholder="Enter password" />
      </div>
      <div className={`mt-6 flex mb-6 ${windowSize <= 350 ? "flex-col gap-1" : "justify-between"}`}>
        <div>
          <input type="checkbox" id="remember-me" onChange={updateRememberMe} />
          <label htmlFor="remember-me" className="ml-2 font-semibold text-[15px]">Remember me</label>
        </div>
        <p className="text-side-text-light dark:text-side-text-gray underline cursor-pointer text-[15px]">
          Forgot password?
        </p>
      </div>
      <Button
        action={loginUser}
        completedText="Logged in successfully"
        defaultText="Log in"
        loadingText="Logging in"
        styles={`btn-primary w-full h-[45px] text-base
        ${checkEmailAndPass(props.emailAddress, props.password) ? 'disabled-btn-light dark:disabled-btn' : ''}`}
        setErrorMessage={setErrorMessage}
        whenComplete={updateUserData}
      />
      <div className={`mt-4 flex m-auto items-center w-fit ${windowSize <= 350 ? "flex-col gap-[1px]" : "gap-1"}`}>
        <p className="text-side-text-light dark:text-side-text-gray">Don't have an account?</p>
        <p className="underline font-semibold text-main-text-black dark:text-main-text-white ml-2 cursor-pointer" 
        onClick={openSignUpPopUp}>
          Sign up
        </p>
      </div>
    </PopUpWrapper>
  )
};

export default Login;