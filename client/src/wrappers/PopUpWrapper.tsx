import OutsideClickHandler from "react-outside-click-handler";

interface Props {
  children: React.ReactNode,
  setPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

const PopUpWrapper: React.FC<Props> = ({ children, setPopUp }) => {
  return (
    <div className="bg-[#31313123] dark:bg-no-reviews-bg fixed top-0 w-[100vw] h-[100vh] flex items-center justify-center">
      <OutsideClickHandler onOutsideClick={() => setPopUp(false)}>
        <div className="max-w-[430px] w-[90vw] m-auto light-component shadow-pop-up-light-shadow border-none dark:gray-component 
        dark:shadow-pop-up-shadow p-5">
          {children}
        </div>
      </OutsideClickHandler>
    </div>
  )
};

export default PopUpWrapper;
