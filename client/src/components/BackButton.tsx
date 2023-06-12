import BackIcon from "../assets/back-sm.png";

interface Props {
  backAction: () => void,
  styles?: string
}

const BackButton: React.FC<Props> = ({ backAction, styles }) => {
  return (
    <button className={`btn-primary h-[37px] w-fit flex items-center justify-center gap-2 pl-3 pr-5 ${styles}`}
    onClick={backAction}>
      <img src={BackIcon} className="w-[25px] h-[25px] mt-[1px]" alt="" />
      Back to cart
    </button>
  )
};

export default BackButton;