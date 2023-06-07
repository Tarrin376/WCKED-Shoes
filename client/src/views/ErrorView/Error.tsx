import { Link, useLocation } from "react-router-dom";
import ErrorIcon from "../../assets/404.png";

const Error: React.FC<{}> = () => {
  const location = useLocation();
  return (
    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
      <img src={ErrorIcon} className="w-[650px] h-[650px] m-auto" alt="404" />
      <h1 className="text-center text-[50px] text-main-text-black dark:text-main-text-white">Something is wrong...</h1>
      <p className="text-side-text-light dark:text-side-text-gray text-[20px] text-center">
        {location.state ? location.state["error"] : 'The page you are looking for could not be found'}
      </p>
      <Link to="/">
        <button className="btn-primary w-[150px] h-[45px] text-base block m-auto mt-10">
          Back to home
        </button>
      </Link>
    </div>
  )
};

export default Error;