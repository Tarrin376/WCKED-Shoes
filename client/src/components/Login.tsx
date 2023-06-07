import PopUpWrapper from "../wrappers/PopUpWrapper";
import { checkEmailAddress, checkPassword, checkEmailAndPass } from "../utils/checkEmailAndPass";
import Star from "./Star";
import axios, { AxiosError } from "axios";
import { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../providers/UserProvider";
import { TUser } from "../@types/TUser";

interface Props {
  setLoginPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  openSignUpPopUp: () => void,
  emailAddress: string
  setEmailAddress: React.Dispatch<React.SetStateAction<string>>,
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
}

const Login: React.FC<Props> = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const userContext = useContext(UserContext);
  const [rememberMe, setRememberMe] = useState(false);

  const loginUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const loginResponse = await axios.post<TUser>("/users/login", {
        email: props.emailAddress,
        password: props.password,
        remember_me: rememberMe
      });

      if (loginResponse.status === 200) {
        props.setLoginPopUp(false);
        userContext?.setUserData((cur) => {
          return {
            ...cur,
            email: loginResponse.data.email,
          }
        });
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

  const updateRememberMe = () => {
    setRememberMe((cur) => !cur);
  }

  return (
    <PopUpWrapper setPopUp={props.setLoginPopUp}>
      <form>
        <Star />
        <h1 className="text-main-text-black dark:text-main-text-white text-2xl mb-6">Log in</h1>
        {errorMessage.length > 0 && <ErrorMessage error={errorMessage} styles="mb-6" />}
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="email" className="font-semibold">Email address</label>
          <input type="email" className={`text-box-light dark:text-box h-[45px] ${!checkEmailAddress(props.emailAddress) ? 'text-box-error-focus' : ''}`} 
          value={props.emailAddress} onChange={(e) => props.setEmailAddress(e.target.value)} id="email" placeholder="Enter email address" />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="email" className="font-semibold">Password</label>
          <input type="password" className={`text-box-light dark:text-box h-[45px] ${!checkPassword(props.password) ? 'text-box-error-focus' : ''}`} 
          value={props.password} onChange={(e) => props.setPassword(e.target.value)} 
          id="email" placeholder="Enter password" />
        </div>
        <div className="mt-6 flex justify-between mb-6">
          <div>
            <input type="checkbox" id="remember-me" onChange={updateRememberMe} />
            <label htmlFor="remember-me" className="ml-2 font-semibold text-[15px]">Remember me</label>
          </div>
          <p className="text-side-text-light dark:text-side-text-gray underline cursor-pointer text-[15px]">Forgot password?</p>
        </div>
        <button type="submit" className={`btn-primary w-full h-[45px] text-base
        ${checkEmailAndPass(props.emailAddress, props.password) ? 'disabled-btn-light dark:disabled-btn' : ''}`}
        onClick={loginUser}>
          Log in
        </button>
        <p className="text-center mt-4 text-side-text-light dark:text-side-text-gray">
          Don't have an account? 
          <span className="underline font-semibold text-main-text-black dark:text-main-text-white ml-2 cursor-pointer" onClick={() => {
            props.setLoginPopUp(false);
            props.openSignUpPopUp();
          }}>
            Sign up
          </span>
        </p>
      </form>
    </PopUpWrapper>
  )
};

export default Login;