import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { Link } from "react-router-dom";
import SearchIcon from "../assets/search.png";
import OutsideClickHandler from "react-outside-click-handler";
import { ThemeContext } from "../providers/ThemeProvider";
import LightThemeIcon from "../assets/sun.png";
import DarkThemeIcon from "../assets/moon.png";
import DarkCartIcon from "../assets/cart-dark.png";
import LightCartIcon from "../assets/cart-light.png";
import LightOrdersIcon from "../assets/orders-icon-light.png";
import DarkOrdersIcon from "../assets/orders-icon-dark.png";
import { useNavigate } from "react-router-dom";
import DarkClose from "../assets/close-dark.png";
import LightClose from "../assets/close-light.png";
import { NavbarProps } from "./Layout";
import { LoggedInProps } from "./Layout";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import { defaultUserData } from "../providers/UserProvider";

interface NavSidebarProps {
  props: NavbarProps, 
  navSidebar: boolean, 
  toggleNavSidebar: () => void
}

interface LoggedInMobileProps extends LoggedInProps {
  closeSidebar: (next: () => void) => void
}

const MobileNavbar: React.FC<NavbarProps> = (props) => {
  const [navSidebar, setNavSidebar] = useState(false);

  const toggleNavSidebar = () => {
    setNavSidebar((cur) => !cur);
  }

  return (
    <>
      <nav className="max-w-screen-2xl w-screen flex items-center justify-between gap-5">
        <Link to="/">
          <button className="text-2xl text-main-text-black dark:text-main-text-white cursor-pointer hover:text-bg-primary-btn-hover btn">
            The Shoes
          </button>
        </Link>
        <div className={`flex flex-col justify-between p-2 rounded-md ${navSidebar ? "outline-dashed outline-[1px] outline-bg-primary-btn" : ""}
        gap-2 w-[48px] h-[48px] cursor-pointer`} onClick={toggleNavSidebar}>
          <div className="w-full h-1/3 bg-main-text-black dark:bg-main-text-white rounded-md"></div>
          <div className="w-full h-1/3 bg-main-text-black dark:bg-main-text-white rounded-md"></div>
          <div className="w-full h-1/3 bg-main-text-black dark:bg-main-text-white rounded-md"></div>
        </div>
      </nav>
      <NavSidebar props={props} navSidebar={navSidebar} toggleNavSidebar={toggleNavSidebar} />
    </>
  )
};

const NavSidebar: React.FC<NavSidebarProps> = ({ props, navSidebar, toggleNavSidebar }) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  const closeSidebar = (next?: () => void) => {
    if (navSidebar) toggleNavSidebar();
    if (next) next();
  }

  return (
    <>
      <OutsideClickHandler onOutsideClick={() => closeSidebar()}>
        <div className={`fixed w-[280px] h-[100vh] transition-all ease-in duration-100 z-10 flex flex-col gap-8 top-0 p-5 
        dark:shadow-gray-component-shadow shadow-light-component-shadow ${navSidebar ? "left-0" : "left-[-280px]"} dark:bg-nav-dark bg-nav-light`}>
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl text-main-text-black dark:text-main-text-white">The Shoes</h1>
              <button onClick={toggleNavSidebar}>
                <img src={themeContext?.darkMode ? DarkClose : LightClose} className="w-[22px] h-[22px]" alt="" />
              </button>
            </div>
            <form onSubmit={(e) => {
              closeSidebar();
              props.searchHandler(e);
            }} className="mt-16">
              <div className="flex items-center text-box-light dark:text-box gap-3">
                <img src={SearchIcon} className="w-[23px] h-[23px]" alt="" />
                <input type="text" value={props.searchQuery} placeholder="Search order or product" 
                className="w-[370px] bg-transparent text-[15px] placeholder:text-search-placeholder focus:outline-none" 
                onChange={props.updateSearchQuery} />
              </div>
            </form>
          </div>
          <div className="flex-grow">
            {userContext?.email !== "" ? 
            <LoggedIn 
              logout={props.logout} 
              openCartPage={props.openCartPage} 
              closeSidebar={closeSidebar}
              errorMessage={props.errorMessage}
              setErrorMessage={props.setErrorMessage} 
            /> : 
            <div className="flex flex-col justify-end h-full">
              <button className="login-btn !w-full mb-3" onClick={() => closeSidebar(props.openLoginPopUp)}>Log in</button>
              <button className="signup-btn !w-full" onClick={() => closeSidebar(props.openSignUpPopUp)}>Sign up</button>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-center text-side-text-light dark:text-side-text-gray">Copyright &copy; 2023</p>
                {themeContext && (themeContext?.darkMode ? 
                <img className="cursor-pointer w-[30px] h-[30px]" src={LightThemeIcon} alt="Light Theme" onClick={themeContext.toggleTheme} /> : 
                <img className="cursor-pointer w-[30px] h-[30px]" src={DarkThemeIcon} alt="Dark Theme" onClick={themeContext.toggleTheme} />)}
              </div>
            </div>}
          </div>
        </div>
      </OutsideClickHandler>
      <div className={`fixed w-[calc(100vw-280px)] transition-all ease-in duration-100 z-10 h-[100vh] top-0 
      ${navSidebar ? "left-[280px]" : "left-[100vw]"} bg-no-reviews-bg opacity-40 dark:opacity-70`}>
      </div>
    </>
  )
}

const LoggedIn: React.FC<LoggedInMobileProps> = (props) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate("/orders");
    window.scrollTo(0, 0);
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <ul className="flex flex-col gap-2">
        <li className="mobile-nav-item" onClick={() => props.closeSidebar(props.openCartPage)}>
          <div className={`${userContext?.cartChanged ? `after:bg-[#ff4b4d] after:w-[6px] after:h-[6px] after:absolute after:top-[-4px] 
            after:rounded-xl after:right-[-4px] after:text-main-text-white after:text-[11px] relative` : ""} cursor-pointer`}>
            {themeContext?.darkMode ?
            <img src={DarkCartIcon} className="w-[28px] h-[28px] ml-5" alt="" /> 
            : <img src={LightCartIcon} className="w-[28px] h-[28px] ml-5" alt="" />}
          </div>
          <p className="text-main-text-black dark:text-main-text-white">View your bag</p>
        </li>
        <li className="mobile-nav-item" onClick={() => props.closeSidebar(goToOrders)}>
          {themeContext?.darkMode ?
            <img src={DarkOrdersIcon} className="w-[28px] h-[28px] ml-5" alt="" /> 
            : <img src={LightOrdersIcon} className="w-[28px] h-[28px] ml-5" alt="" />}
          <p className="text-main-text-black dark:text-main-text-white">
            Your orders
          </p>
        </li>
      </ul>
      <div>
        <p className="text-main-text-black dark:text-main-text-white text-sm mb-4">
          Logged in as:
          <span className="font-semibold ml-2">{userContext?.email}</span>
        </p>
        {!props.errorMessage ? 
        <Button 
          action={props.logout} 
          completedText="Logged out" 
          defaultText="Log out" 
          loadingText="Logging out" 
          styles="signup-btn !w-full"
          setErrorMessage={props.setErrorMessage}
          whenComplete={() => userContext?.setUserData(defaultUserData)}
        /> : 
        <ErrorMessage 
          error={props.errorMessage.message}
          styles="!mt-0"
        />}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-center text-side-text-light dark:text-side-text-gray">Copyright &copy; 2023</p>
          {themeContext && (themeContext?.darkMode ? 
          <img className="cursor-pointer w-[30px] h-[30px]" src={LightThemeIcon} alt="Light Theme" onClick={themeContext.toggleTheme} /> : 
          <img className="cursor-pointer w-[30px] h-[30px]" src={DarkThemeIcon} alt="Dark Theme" onClick={themeContext.toggleTheme} />)}
        </div>
      </div>
    </div>
  )
}

export default MobileNavbar;
