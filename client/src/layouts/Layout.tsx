import { useState, useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { defaultUserData } from "../providers/UserProvider";
import axios, { AxiosError } from "axios";
import { useWindowSize } from "../hooks/useWindowSize";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import VerifyEmail from "../components/VerifyEmail";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../providers/ThemeProvider";
import { useNavigate } from "react-router-dom";

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
  const themeContext = useContext(ThemeContext);

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
  }

  const logout = async () => {
    try {
      const logoutRequest = await axios.get<string>("/users/logout");
      if (logoutRequest.status === 200) {
        userContext?.setUserData(defaultUserData);
      }
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError;
        console.log(err?.response?.data);
      }
    }
  }

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.length > 0) {
      if (!searchQuery.match(new RegExp("^[0-9]+$"))) navigate(`/`, { state: searchQuery });
      else navigate(`/orders/${searchQuery}`);
      setSearchQuery("");
    }
  }

  return (
    <>
      <div className="dark:bg-nav-dark bg-nav-light flex justify-center items-center h-[90px] 
      px-3 border-b border-light-border dark:border-main-gray-border">
        {windowSize >= 945 ? 
        <DesktopNavbar 
          searchQuery={searchQuery}
          openLoginPopUp={openLoginPopUp}
          openSignUpPopUp={openSignUpPopUp}
          openVerifyEmailPopUp={openVerifyEmailPopUp}
          updateSearchQuery={updateSearchQuery}
          searchHandler={searchHandler}
          logout={logout}
          openCartPage={openCartPage}
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
        />}
      </div>
      <div className="mt-[70px] min-h-[calc(100vh-70px-90px)] max-w-screen-2xl max-2xl:max-w-screen-xl max-xl:max-w-screen-lg 
      max-lg:max-w-screen-md w-screen max-md:max-w-screen-sm max-sm:max-w-screen-xs m-auto mb-[70px] px-[15px] overflow-hidden 
      dark:bg-bg-dark bg-bg-light">
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
      <div className="bg-[#f4f4f5] dark:bg-[#0c0c0c] md:px-20 max-md:px-[30px] py-9">
        <div className="max-w-screen-2xl m-auto flex flex-col">
          <div className="flex items-center justify-between max-xl:flex-col max-xl:gap-5">
            <div>
              <h1 className="text-2xl text-main-text-black dark:text-main-text-white mb-2 max-xl:text-center">Sign up to our newsletter</h1>
              <p className="text-side-text-light dark:text-side-text-gray max-xl:text-center max-xl:max-w-[410px]">Stay up to date with the latest news, newest releases, and announcements.</p>
            </div>
            <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
              <input type="text" className="text-box-light dark:text-box sm:w-[250px] max-sm:w-full h-[40px]" placeholder="Enter your email" />
              <button className="btn-primary w-[110px] h-[40px] max-sm:w-full">Subscribe</button>
            </div>
          </div>
          <div className="flex xl:gap-20 max-xl:gap-9 xl:py-20 max-xl:py-9 flex-grow border-b border-b-light-border dark:border-b-main-gray-border max-xl:flex-col">
            <div className="w-[330px] max-xl:w-full">
              <h1 className="text-2xl text-main-text-black dark:text-main-text-white mb-3 max-xl:text-center">
                The shoes
              </h1>
              <p className="text-side-text-light dark:text-side-text-gray max-xl:text-center max-xl:m-auto max-xl:max-w-[370px]">
                Find amazing deals on your favourite sneakers while having a 100% authenticity guarantee!
              </p>
            </div>
            <div className="flex flex-grow justify-center md:gap-16 max-md:gap-6 max-md:flex-col-reverse max-md:items-center">
              <div>
                <h2 className="text-main-text-black dark:text-main-text-white mb-2 font-semibold max-md:text-center">External APIs used</h2>
                <a href="https://restcountries.com/" className="footer-link">REST Countries</a>
              </div>
              <div>
                <h2 className="text-main-text-black dark:text-main-text-white mb-2 font-semibold max-md:text-center">Node Packages</h2>
                <a href="https://www.npmjs.com/package/react-outside-click-handler" className="footer-link">react-outside-click-handler</a>
                <a href="https://www.npmjs.com/package/card-validator" className="footer-link">card-validator</a>
                <a href="https://www.npmjs.com/package/tailwind-scrollbar-hide" className="footer-link">tailwind-scrollbar-hide</a>
                <a href="https://www.npmjs.com/package/axios" className="footer-link">axios</a>
              </div>
            </div>
          </div>
          <p className="pt-6 text-right text-side-text-light dark:text-side-text-gray">&copy; 2023 The Shoes. All rights reserved.</p>
        </div>
      </div>
    </>
  )
};

export default Layout;