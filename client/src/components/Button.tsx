import gear from "../assets/gear.svg";
import { useEffect, useRef, useState } from "react";
import { TErrorMessage } from "../@types/TErrorMessage";

interface Props {
  action: () => Promise<TErrorMessage | undefined>,
  completedText: string,
  defaultText: string,
  loadingText: string,
  styles: string,
  children?: React.ReactNode,
  setErrorMessage: React.Dispatch<React.SetStateAction<TErrorMessage | undefined>>,
  whenComplete?: () => void
}

const Button: React.FC<Props> = ({ action, completedText, defaultText, loadingText, styles, children, setErrorMessage, whenComplete }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnText, setBtnText] = useState(defaultText);

  const handleAction = async () => {
    setBtnText(loadingText);
    setTimeout(() => {
      (async () => {
        const error = await action();
        if (!error) {
          setBtnText(completedText);
        } else {
          setErrorMessage(error);
          setTimeout(() => setErrorMessage(undefined), 3500);
          setBtnText(defaultText);
        }
      })()
    }, 500)
  }

  useEffect(() => {
    if (btnText !== completedText || !btnRef || !btnRef.current) {
      return;
    }
    
    btnRef.current.classList.add('success-btn');
    setTimeout(() => {
      if (btnRef && btnRef.current) {
        btnRef.current.classList.remove('success-btn');
        setBtnText(defaultText);
        if (whenComplete) {
          whenComplete();
        }
      }
    }, 1500);
  }, [btnText, completedText, defaultText, whenComplete])

  useEffect(() => {
    setBtnText(defaultText);
  }, [defaultText])

  return (
    <button className={`${styles} ${btnText !== defaultText ? "pointer-events-none btn" : ""}`} 
    ref={btnRef} onClick={handleAction}>
      <div className="flex items-center justify-center gap-3">
        {btnText === loadingText ? <img src={gear} className="w-[20px] h-[20px] mt-[1px]" alt="gear" />
        : children && btnText === defaultText && children}
        <p className="mb-[1px]">{btnText}</p>
      </div>
    </button>
  )
};

export default Button;
