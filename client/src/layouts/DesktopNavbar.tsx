import { Link } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { useContext } from "react";
import DarkCartIcon from "../assets/cart-dark.png";
import LightCartIcon from "../assets/cart-light.png";
import SearchIcon from "../assets/search.png";
import { ThemeContext } from "../providers/ThemeProvider";
import LightThemeIcon from "../assets/sun.png";
import DarkThemeIcon from "../assets/moon.png";
import { useWindowSize } from "../hooks/useWindowSize";
import Button from "../components/Button";
import { NavbarProps } from "./Layout";
import { LoggedInProps } from "./Layout";
import ErrorMessage from "../components/ErrorMessage";
import { defaultUserData } from "../providers/UserProvider";

const DesktopNavbar: React.FC<NavbarProps> = (props) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const windowSize = useWindowSize();

  return (
    <nav className="max-w-screen-2xl w-screen flex items-center justify-between gap-5">
      <div className="flex items-center gap-[70px]">
        <Link to="/">
          <button className="text-2xl text-main-text-black dark:text-main-text-white cursor-pointer hover:!text-bg-primary-btn-hover btn">
            Wicked shoes
          </button>
        </Link>
        <form onSubmit={props.searchHandler}>
          <div className="flex items-center text-box-light dark:text-box gap-3">
            <img src={SearchIcon} className="w-[23px] h-[23px]" alt="" />
            <input type="text" value={props.searchQuery} placeholder="Search order or product" 
            className={`${windowSize <= 1145 ? "w-[250px]" : "w-[320px]"} bg-transparent text-[15px] placeholder:text-search-placeholder-light 
            dark:placeholder:text-search-placeholder-dark focus:outline-none`}
            onChange={props.updateSearchQuery} />
          </div>
        </form>
        {userContext?.email !== "" && !props.errorMessage &&
        <ul>
          <Link to="orders">
            <li className="nav-item">
              Your Orders
            </li>
          </Link>
        </ul>}
      </div>
      <div className="flex items-center gap-5">
        {userContext?.email !== "" ? 
        <LoggedIn 
          logout={props.logout} 
          openCartPage={props.openCartPage} 
          errorMessage={props.errorMessage}
          setErrorMessage={props.setErrorMessage}
        /> : 
        <>
          <button className="login-btn" onClick={props.openLoginPopUp}>Log in</button>
          <button className="signup-btn" onClick={props.openSignUpPopUp}>Sign up</button>
        </>}
        {themeContext && (themeContext?.darkMode ? 
        <img className="cursor-pointer w-[30px] h-[30px]" src={LightThemeIcon} alt="Light Theme" onClick={themeContext.toggleTheme} /> : 
        <img className="cursor-pointer w-[30px] h-[30px]" src={DarkThemeIcon} alt="Dark Theme" onClick={themeContext.toggleTheme} />)}
      </div>
    </nav>
  )
};

const LoggedIn: React.FC<LoggedInProps> = (props) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  return (
    <>
      {!props.errorMessage && 
      <div className="text-main-text-black dark:text-main-text-white text-sm">
        <p>Logged in as:</p>
        <p className="font-semibold">{userContext?.email}</p>
      </div>}
      {!props.errorMessage ? 
      <Button 
        action={props.logout} 
        completedText="Logged out" 
        defaultText="Log out" 
        loadingText="Logging out" 
        styles="signup-btn"
        setErrorMessage={props.setErrorMessage}
        whenComplete={() => userContext?.setUserData(defaultUserData)}
      /> : 
      <ErrorMessage 
        error={props.errorMessage.message}
        styles="!mt-0 !py-2"
      />}
      <div className={`${userContext?.cartChanged ? `after:bg-[#ff4b4d] after:w-[6px] after:h-[6px] after:absolute after:top-[-4px] 
      after:rounded-xl after:right-[-4px] after:text-main-text-white after:text-[11px] relative` : ""} cursor-pointer`} 
      onClick={props.openCartPage}>
        {themeContext?.darkMode ?
            <img src={DarkCartIcon} className="w-[28px] h-[28px] ml-5" alt="cart" /> : 
            <img src={LightCartIcon} className="w-[28px] h-[28px] ml-5" alt="cart" />}
      </div>
    </>
  )
}

export default DesktopNavbar;