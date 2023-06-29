
const Footer = () => {
  return (
    <div className="bg-[#f4f4f5] dark:bg-[#080808] md:px-20 max-md:px-[30px] py-9">
      <div className="max-w-screen-2xl m-auto flex flex-col">
        <div className="flex items-center justify-between max-xl:flex-col max-xl:gap-5">
          <div>
            <h1 className="text-2xl text-main-text-black dark:text-main-text-white mb-2 max-xl:text-center">Sign up to our newsletter</h1>
            <p className="text-side-text-light dark:text-side-text-gray max-xl:text-center max-xl:max-w-[410px]">Stay up to date with the latest news, newest releases, and announcements.</p>
          </div>
          <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
            <input type="text" className="text-box-light dark:text-box sm:w-[250px] max-sm:w-full h-[40px]" placeholder="Enter your email" />
            <button className="btn-primary w-[110px] h-[40px] max-sm:w-full">Subscribe</button>
          </div>
        </div>
        <div className="flex xl:gap-20 max-xl:gap-9 xl:py-20 max-xl:py-9 flex-grow border-b border-b-light-border dark:border-b-main-gray-border max-xl:flex-col">
          <div className="w-[330px] max-xl:w-full">
            <h1 className="text-2xl text-main-text-black dark:text-main-text-white mb-3 max-xl:text-center">
              WCKED Shoes
            </h1>
            <p className="text-side-text-light dark:text-side-text-gray max-xl:text-center max-xl:m-auto max-xl:max-w-[370px]">
              Find amazing deals on your favourite sneakers while having a 100% authenticity guarantee!
            </p>
          </div>
          <div className="flex flex-grow justify-center md:gap-16 max-md:gap-6 max-md:flex-col-reverse max-md:items-center">
            <div>
              <h2 className="text-main-text-black dark:text-main-text-white mb-2 font-semibold max-md:text-center">External APIs used</h2>
              <a href="https://restcountries.com/" className="footer-link">REST Countries</a>
            </div>
            <div>
              <h2 className="text-main-text-black dark:text-main-text-white mb-2 font-semibold max-md:text-center">Icons</h2>
              <a href="https://icons8.com/license" className="footer-link">Icons8</a>
            </div>
            <div>
              <h2 className="text-main-text-black dark:text-main-text-white mb-2 font-semibold max-md:text-center">Node Packages</h2>
              <a href="https://www.npmjs.com/package/react-outside-click-handler" className="footer-link">react-outside-click-handler</a>
              <a href="https://www.npmjs.com/package/card-validator" className="footer-link">card-validator</a>
              <a href="https://www.npmjs.com/package/tailwind-scrollbar-hide" className="footer-link">tailwind-scrollbar-hide</a>
              <a href="https://www.npmjs.com/package/axios" className="footer-link">axios</a>
            </div>
          </div>
        </div>
        <p className="pt-6 text-right text-side-text-light dark:text-side-text-gray">&copy; 2023 WCKED Shoes. All rights reserved.</p>
      </div>
    </div>
  )
};

export default Footer;