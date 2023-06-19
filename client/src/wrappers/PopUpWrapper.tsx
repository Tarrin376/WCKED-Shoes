import OutsideClickHandler from "react-outside-click-handler";
import LightClose from "../assets/close-light.png";
import DarkClose from "../assets/close-dark.png";
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";
import Star from "../components/Star";

interface Props {
  children: React.ReactNode,
  setPopUp: React.Dispatch<React.SetStateAction<boolean>>,
  popUpStyles?: string,
  title?: string,
  star?: boolean,
}

const PopUpWrapper: React.FC<Props> = ({ children, setPopUp, popUpStyles, title, star }) => {
  const themeContext = useContext(ThemeContext);

  const closePopUp = () => {
    setPopUp(false);
  }

  return (
    <div className="bg-[#0f0f0fb4] dark:bg-[#0c0c0cde] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center">
      <OutsideClickHandler onOutsideClick={closePopUp}>
        <div className={`max-w-[430px] w-[90vw] max-h-[90vh] m-auto light-component shadow-pop-up-light-shadow dark:gray-component 
        dark:shadow-pop-up-shadow p-5 pt-4 ${popUpStyles}`}>
          <div className="mb-5 flex justify-between gap-4">
            {!star ? <h1 className="text-main-text-black dark:text-main-text-white text-[26px]">
              {title}
            </h1> : 
            <Star />}
            <button onClick={closePopUp}>
              <img src={themeContext?.darkMode ? DarkClose : LightClose} className="w-[22px] h-[22px]" alt="" />
            </button>
          </div>
          {children}
        </div>
      </OutsideClickHandler>
    </div>
  )
};

export default PopUpWrapper;
