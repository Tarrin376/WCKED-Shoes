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
  setErrorMessage: React.Dispatch<React.SetStateAction<TErrorMessage | undefined>>
}

const Button: React.FC<Props> = (props) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnText, setBtnText] = useState(props.defaultText);

  const setStyle = (text: string) => {
    if (btnRef && btnRef.current) {
      btnRef.current.classList.add('success-btn');

      setTimeout(() => {
        if (btnRef && btnRef.current) {
          btnRef.current.classList.remove('success-btn');
          setBtnText(text);
        }
      }, 3000);
    }
  }

  const handleAction = async () => {
    setBtnText(props.loadingText);
    setTimeout(() => {
      (async () => {
        const error = await props.action();
        if (!error) {
          setBtnText(props.completedText);
        } else {
          props.setErrorMessage(error);
          setTimeout(() => props.setErrorMessage(undefined), 5000);
          setBtnText(props.defaultText);
        }
      })()
    }, 500)
  }

  useEffect(() => {
    if (btnText === props.completedText) {
      setStyle(props.defaultText);
    }
  }, [btnText, props.completedText, props.defaultText])

  useEffect(() => {
    setBtnText(props.defaultText);
  }, [props.defaultText])

  return (
    <button className={`${props.styles} ${btnText !== props.defaultText ? "pointer-events-none btn" : ""}`} 
    ref={btnRef} onClick={handleAction}>
      <div className="flex items-center justify-center gap-3">
        {btnText === props.loadingText ? <img src={gear} className="w-[20px] h-[20px] mt-[1px]" alt="gear" />
        : props.children && btnText === props.defaultText && props.children}
        <p className="mb-[1px]">{btnText}</p>
      </div>
    </button>
  )
};

export default Button;
