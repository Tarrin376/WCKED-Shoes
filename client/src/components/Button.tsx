import gear from "../assets/gear.svg";
import { useEffect, useRef, useState } from "react";

interface Props {
  action: () => Promise<boolean>,
  completedText: string,
  defaultText: string,
  loadingText: string,
  styles: string,
  children?: React.ReactNode
}

const Button: React.FC<Props> = (props) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnText, setBtnText] = useState(props.defaultText);

  const setBgColor = (color: string, text: string) => {
    if (btnRef && btnRef.current) {
      btnRef.current.style.backgroundColor = color;
      setTimeout(() => {
        if (btnRef && btnRef.current) {
          btnRef!.current!.style.backgroundColor = "";
          setBtnText(text);
        }
      }, 2000);
    }
  }

  const handleAction = async () => {
    setBtnText(props.loadingText);
    const success = await props.action();
    if (success) {
      setBtnText(props.completedText);
    } else {
      setBtnText(props.defaultText);
    }
  }

  useEffect(() => {
    if (btnText === props.completedText) {
      setBgColor("#1cad21", props.defaultText);
    }
  }, [btnText, props.completedText, props.defaultText])

  return (
    <button className={`${props.styles} ${btnText !== props.defaultText ? "pointer-events-none btn" : ""}`} 
    ref={btnRef} onClick={handleAction}>
      <div className="flex items-center gap-3">
        {btnText === props.loadingText ? <img src={gear} className="w-[20px] h-[20px] mt-[1px]" alt="gear" />
        : props.children && btnText === props.defaultText && props.children}
        <p className="mb-[1px]">{btnText}</p>
      </div>
    </button>
  )
};

export default Button;
