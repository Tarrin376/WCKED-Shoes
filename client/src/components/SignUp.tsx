import PopUpWrapper from "../wrappers/PopUpWrapper";
import { useState, useEffect } from "react";
import { isOkPassword, isMediumPassword, isStrongPassword } from "../utils/checkPasswordStrength";
import { checkEmailAddress, checkPassword, checkEmailAndPass } from "../utils/checkEmailAndPass";
import axios, { AxiosError } from "axios";
import ErrorMessage from "./ErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import Button from "./Button";

interface Props {
  setSignUpPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  openLoginPopUp: () => void,
  openVerifyEmailPopUp: () => void,
  emailAddress: string
  setEmailAddress: React.Dispatch<React.SetStateAction<string>>,
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
}

enum passwordStrength {
  weak,
  ok,
  medium,
  strong
}

const strengthColours = ["!bg-main-red", "!bg-[#ff8700]", "!bg-[#ffdd00]", "!bg-[#44da25]"];
const passwordStrengthOptions = 4;

const SignUp: React.FC<Props> = (props) => {
  const [strength, setStrength] = useState(passwordStrength.weak);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const createAccount = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.post<string>(`/api/users/find`, { email: props.emailAddress });
      return { message: "User with this email address already exists.", status: 400 };
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      if (errorMsg.status === 404) {
        props.setSignUpPopUp(false);
        props.openVerifyEmailPopUp();
      } else {
        return errorMsg;
      }
    }
  }

  const updatePasswordStrength = (password: string) => {
    if (isStrongPassword(password)) setStrength(passwordStrength.strong);
    else if (isMediumPassword(password)) setStrength(passwordStrength.medium);
    else if (isOkPassword(password)) setStrength(passwordStrength.ok);
    else setStrength(passwordStrength.weak);
  }

  const openLogInPopUp = () => {
    props.setSignUpPopUp(false);
    props.openLoginPopUp();
  }

  useEffect(() => {
    updatePasswordStrength(props.password);
  }, [props.password])

  return (
    <PopUpWrapper setPopUp={props.setSignUpPopUp} star={true}>
      <h1 className="text-main-text-black dark:text-main-text-white text-2xl mb-2">Sign up</h1>
      <p className="mb-6 text-side-text-light dark:text-side-text-gray">Create an account and start saving thousands of design hours with a 30-day free trial</p>
      {errorMessage && <ErrorMessage error={errorMessage.message} styles="mb-6" />}
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="email" className="font-semibold">Email address</label>
        <input type="email" className={`text-box-light dark:text-box h-[45px] ${!checkEmailAddress(props.emailAddress) ? 'text-box-error-focus' : ''}`} 
        value={props.emailAddress} onChange={(e) => props.setEmailAddress(e.target.value)} id="email" placeholder="example@email.com" />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="email" className="font-semibold">Password</label>
        <input type="password" className={`text-box-light dark:text-box h-[45px] ${!checkPassword(props.password) ? 'text-box-error-focus' : ''}`} 
        value={props.password} onChange={(e) => props.setPassword(e.target.value)} id="email" placeholder="Minimum of 8 characters" />
      </div>
      <div className="flex justify-evenly gap-4 mb-6">
        {new Array(passwordStrengthOptions).fill(0).map((_, i) => {
          return (
            <div className={`pass-strength ${i <= strength ? strengthColours[strength] : ``}`} key={i}>
            </div>
          );
        })}
      </div>
      <Button
        action={createAccount}
        completedText="Valid credentials"
        defaultText="Sign up"
        loadingText="Checking credentials"
        styles={`btn-primary w-full h-[45px] text-base
        ${checkEmailAndPass(props.emailAddress, props.password) ? 'disabled-btn-light dark:disabled-btn' : ''}`}
        setErrorMessage={setErrorMessage}
      />
      <p className="text-center mt-4 text-side-text-light dark:text-side-text-gray">
        Already have an account? 
        <span className="underline font-semibold text-main-black dark:text-main-text-white ml-2 cursor-pointer" onClick={openLogInPopUp}>
          Log in
        </span>
      </p>
    </PopUpWrapper>
  )
};

export default SignUp;