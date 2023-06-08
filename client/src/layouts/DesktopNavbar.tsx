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

interface Props {
  searchQuery: string,
  openLoginPopUp: () => void,
  openSignUpPopUp: () => void,
  openVerifyEmailPopUp: () => void,
  updateSearchQuery: (e: React.ChangeEvent<HTMLInputElement>) => void,
  searchHandler: (e: React.FormEvent<HTMLFormElement>) => void,
  logout: () => Promise<void>,
  openCartPage: () => void,
}

const DesktopNavbar: React.FC<Props> = (props) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const windowSize = useWindowSize();

  return (
    <nav className="max-w-screen-2xl w-screen flex items-center justify-between gap-5">
      <div className="flex items-center gap-[70px]">
        <Link to="/">
          <button className="text-2xl text-main-text-black dark:text-main-text-white cursor-pointer hover:!text-bg-primary-btn-hover btn">
            The Shoes
          </button>
        </Link>
        <form onSubmit={props.searchHandler}>
          <div className="flex items-center text-box-light dark:text-box gap-3">
            <img src={SearchIcon} className="w-[23px] h-[23px]" alt="" />
            <input type="text" value={props.searchQuery} placeholder="Search order or product" 
            className={`${windowSize <= 1000 ? "w-[250px]" : "w-[320px]"} bg-transparent text-[15px] placeholder:text-search-placeholder-light 
            dark:placeholder:text-search-placeholder-dark focus:outline-none`}
            onChange={props.updateSearchQuery} />
          </div>
        </form>
        {userContext?.email !== "" && 
        <ul>
          <Link to="orders">
            <li className="nav-item">
              Your Orders
            </li>
          </Link>
        </ul>}
      </div>
      <div className="flex items-center gap-5">
        {userContext?.email !== "" ? <LoggedIn logout={props.logout} openCartPage={props.openCartPage} /> : 
        <>
          <button className="btn text-main-text-black dark:text-main-text-white border border-main-text-black 
          dark:border-search-border bg-transparent h-[40px] w-[100px] rounded-md 
          dark:hover:bg-[#2B2B2B] hover:bg-main-text-black hover:text-main-text-white text-[15px]" onClick={props.openLoginPopUp}>
            Log in
          </button>
          <button className="h-[40px] w-[100px] btn-primary text-[15px]" onClick={props.openSignUpPopUp}>
            Sign up
          </button>
        </>}
        {themeContext && (themeContext?.darkMode ? 
        <img className="cursor-pointer w-[30px] h-[30px]" src={LightThemeIcon} alt="Light Theme" onClick={themeContext.toggleTheme} /> : 
        <img className="cursor-pointer w-[30px] h-[30px]" src={DarkThemeIcon} alt="Dark Theme" onClick={themeContext.toggleTheme} />)}
      </div>
    </nav>
  )
};

const LoggedIn: React.FC<{ logout: () => Promise<void>, openCartPage: () => void }> = ({ logout, openCartPage }) => {
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <div className="text-main-text-black dark:text-main-text-white text-sm">
        <p>Logged in as:</p>
        <p className="font-semibold">{userContext?.email}</p>
      </div>
      <button className="h-[40px] w-[100px] btn-primary text-[15px]" onClick={logout}>Log out</button>
      <div className={`${userContext?.cartChanged ? `after:bg-[#ff4b4d] after:w-[6px] after:h-[6px] after:absolute after:top-[-4px] 
      after:rounded-xl after:right-[-4px] after:text-main-text-white after:text-[11px] relative` : ""} cursor-pointer`} onClick={openCartPage}>
        {themeContext?.darkMode ?
            <img src={DarkCartIcon} className="w-[28px] h-[28px] ml-5" alt="cart" /> : 
            <img src={LightCartIcon} className="w-[28px] h-[28px] ml-5" alt="cart" />}
      </div>
    </>
  )
}

export default DesktopNavbar;