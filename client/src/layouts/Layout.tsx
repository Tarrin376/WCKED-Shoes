import { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { useWindowSize } from "../hooks/useWindowSize";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import VerifyEmail from "../components/VerifyEmail";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";
import Footer from "./Footer";

export interface NavbarProps {
  searchQuery: string,
  openLoginPopUp: () => void,
  openSignUpPopUp: () => void,
  openVerifyEmailPopUp: () => void,
  updateSearchQuery: (e: React.ChangeEvent<HTMLInputElement>) => void,
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void,
  logout: () => Promise<TErrorMessage | undefined>,
  openCartPage: () => void,
  errorMessage: TErrorMessage | undefined,
  setErrorMessage: React.Dispatch<React.SetStateAction<TErrorMessage | undefined>>
}

export interface LoggedInProps {
  logout: () => Promise<TErrorMessage | undefined>, 
  openCartPage: () => void,
  errorMessage: TErrorMessage | undefined,
  setErrorMessage: React.Dispatch<React.SetStateAction<TErrorMessage | undefined>>
}

const Layout: React.FC<{}> = () => {
  const [loginPopUp, setLoginPopUp] = useState(false);
  const [signUpPopUp, setSignUpPopUp] = useState(false);
  const [verifyEmailPopUp, setVerifyEmailPopUp] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const openLoginPopUp = () => {
    setLoginPopUp(true);
  }

  const openSignUpPopUp = () => {
    setSignUpPopUp(true);
  }

  const openVerifyEmailPopUp = () => {
    setVerifyEmailPopUp(true);
  }

  const updateSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const openCartPage = () => {
    userContext?.setUserData((cur) => {
      return {
        ...cur,
        cartChanged: false
      }
    });

    navigate("/cart");
    window.scrollTo(0, 0);
  }

  const logout = async (): Promise<TErrorMessage | undefined> => {
    try {
      await axios.get<string>("/api/users/logout");
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.length > 0) {
      if (!searchQuery.match(new RegExp("^[0-9]+$"))) navigate(`/`, { state: searchQuery });
      else navigate(`/orders/${searchQuery}`);
      setSearchQuery("");
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      <div className="dark:bg-nav-dark bg-nav-light flex justify-center items-center h-[90px] px-3 border-b border-light-border 
      dark:border-main-gray-border">
        {windowSize >= 1076 ? 
        <DesktopNavbar 
          searchQuery={searchQuery}
          openLoginPopUp={openLoginPopUp}
          openSignUpPopUp={openSignUpPopUp}
          openVerifyEmailPopUp={openVerifyEmailPopUp}
          updateSearchQuery={updateSearchQuery}
          searchHandler={searchHandler}
          logout={logout}
          openCartPage={openCartPage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        /> : 
        <MobileNavbar
          searchQuery={searchQuery}
          openLoginPopUp={openLoginPopUp}
          openSignUpPopUp={openSignUpPopUp}
          openVerifyEmailPopUp={openVerifyEmailPopUp}
          updateSearchQuery={updateSearchQuery}
          searchHandler={searchHandler}
          logout={logout} 
          openCartPage={openCartPage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />}
      </div>
      <div className="mt-[70px] min-h-[calc(100vh-70px-90px)] max-w-screen-2xl max-2xl:max-w-screen-xl max-xl:max-w-screen-lg 
      max-lg:max-w-screen-md w-screen max-md:max-w-screen-sm max-sm:max-w-screen-xs m-auto mb-[70px] px-[25px] max-md:px-[15px] 
      overflow-hidden dark:bg-bg-dark bg-bg-light">
        <Outlet />
      </div>
      {loginPopUp && 
      <Login 
        setLoginPopUp={setLoginPopUp} openSignUpPopUp={openSignUpPopUp}
        emailAddress={emailAddress} setEmailAddress={setEmailAddress}
        password={password} setPassword={setPassword}
      />}
      {signUpPopUp && 
      <SignUp 
        setSignUpPopUp={setSignUpPopUp} openLoginPopUp={openLoginPopUp} 
        openVerifyEmailPopUp={openVerifyEmailPopUp}
        emailAddress={emailAddress} setEmailAddress={setEmailAddress}
        password={password} setPassword={setPassword}
      />}
      {verifyEmailPopUp && 
      <VerifyEmail 
        setVerifyEmailPopUp={setVerifyEmailPopUp}
        setSignUpPopUp={setSignUpPopUp}
        emailAddress={emailAddress} password={password}
      />}
      <Footer />
    </>
  )
};

export default Layout;