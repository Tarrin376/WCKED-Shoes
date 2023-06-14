
const Star = () => {
  return (
    <div className="bg-main-text-black dark:bg-main-text-white w-[50px] h-[50px] mb-4">
      <div className="flex h-[25px]">
        <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-br-full"></div>
        <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-bl-full"></div>
      </div>
      <div className="flex h-[25px]">
      <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-tr-full"></div>
        <div className="w-1/2 bg-nav-light dark:bg-main-gray rounded-tl-full"></div>
      </div>
    </div>
  );
};

export default Star;
