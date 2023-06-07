import UKFlag from "../assets/united-kingdom.png";
import FranceFlag from "../assets/france.png";

const Star = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="bg-main-text-black dark:bg-main-text-white w-[50px] h-[50px]">
        <div className="flex h-[25px]">
          <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-br-full"></div>
          <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-bl-full"></div>
        </div>
        <div className="flex h-[25px]">
        <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-tr-full"></div>
          <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-tl-full"></div>
        </div>
      </div>
      <div className="flex w-[122px] h-[42px] rounded-md bg-light-border dark:bg-[#202020] p-1">
        <div className="p-2 w-[50%] bg-main-text-white dark:bg-loading-gray rounded-[3px] relative cursor-pointer">
          <img src={UKFlag} className="absolute w-[38px] h-[31px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" alt="UK" />
        </div>
        <div className="p-2 w-[50%] rounded-[3px] relative cursor-pointer">
          <img src={FranceFlag} className="absolute w-[38px] h-[31px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" alt="France" />
        </div>
      </div>
    </div>
  );
};

export default Star;
