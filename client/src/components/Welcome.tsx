import PopUpWrapper from "../wrappers/PopUpWrapper";
import ReactIcon from "../assets/react.png";
import RedisIcon from "../assets/redis.png";
import PostgreSQLIcon from "../assets/postgresql.png";
import PythonIcon from "../assets/python.png";
import TailwindIcon from "../assets/tailwind.png";
import { useRef } from "react";

interface Props {
  setWelcomePopUp: React.Dispatch<React.SetStateAction<boolean>>
}

type TTechnologyItem = {
  techName: string,
  image: string
}

const technologies: TTechnologyItem[] = [
  { techName: "React (Typescript)", image: ReactIcon },
  { techName: "Redis", image: RedisIcon },
  { techName: "PostgreSQL", image: PostgreSQLIcon },
  { techName: "Flask", image: PythonIcon },
  { techName: "Tailwind CSS", image: TailwindIcon }
];

const mainFeatures = [
  "Uses Amazon's item-to-item collaborative filtering algorithm for product recommendations.",
  "Recommends 'frequently bought together' products to users.",
  "Recommends products to buy again using my own algorithm",
  "Uses Redis to cache API calls and implement rate-limiting to help avoid malicious users from exhausting system resources.",
  "Allows users to monitor the progress of their orders and gives authorised personel the ability to update these orders through the backend API.",
  "Users can read, upvote, and write reviews for products. You can filter by 'verified purchases' which only show reviews written by customers that have purchased and recieved the product.",
  "Users can search for products and sort them by popularity, rating, and carbon footprint.",
  "Maintains session data using JWT's to provide a better user experience when revisiting the site.",
  "Discount codes can be applied to orders when checking out. These codes can only be used once and can be set to 'expired' by authorized personel."
]

const validDiscountCodes = ["WELCOME", "WICKED", "FRESH"];
const expiredDiscountCodes = ["HELLO", "ORANGE", "SHOES"]

const Welcome: React.FC<Props> = ({ setWelcomePopUp }) => {
  const dontShowAgain = useRef(false);

  const toggleDontShowAgain = () => {
    dontShowAgain.current = !dontShowAgain.current;
  }

  const continueToProject = () => {
    localStorage.setItem("dont-show-again", `${dontShowAgain.current}`);
    setWelcomePopUp(false);
  }

  return (
    <PopUpWrapper setPopUp={setWelcomePopUp} popUpStyles="max-w-[600px] overflow-y-scroll" title="Welcome!">
      <h3 className="text-side-text-red mb-2">*Important, please read!</h3>
      <p className="text-side-text-light dark:text-side-text-gray mb-3">
        This is a side project, not a legitimate e-commerce site. 
        "Payments" made by you will not charge your bank account and is just there to simulate the payment process. 
        However, I strongly recommend for security purposes to not use your bank details when using this site.
      </p>
      <p className="mb-2">Technologies I have used for this app:</p>
      <ul className="text-side-text-light dark:text-side-text-gray mb-3">
        {technologies.map((technology: TTechnologyItem, index: number) => {
          return (
            <TechnologyItem 
              technology={technology} 
              key={index} 
            />
          )
        })}
      </ul>
      <p className="mb-2">Main features of this app:</p>
      <ul className="text-side-text-light dark:text-side-text-gray mb-3 ml-5 list-disc flex flex-col gap-2">
        {mainFeatures.map((feature: string, index: number) => {
          return (
            <li key={index}>
              {feature}
            </li>
          )
        })}
      </ul>
      <p className="mb-2">Valid discount codes to try out:</p>
      <ul className="text-green-light dark:text-green-dark mb-3 ml-5 list-disc flex flex-col gap-2">
        {validDiscountCodes.map((discountCode: string, index: number) => {
            return (
              <li key={index}>
                {discountCode}
              </li>
            )
        })}
      </ul>
      <p className="mb-2">Expired discount codes to try out:</p>
      <ul className="text-side-text-red mb-3 ml-5 list-disc flex flex-col gap-2">
        {expiredDiscountCodes.map((discountCode: string, index: number) => {
            return (
              <li key={index}>
                {discountCode}
              </li>
            )
        })}
      </ul>
      <p className="text-[18px] font-semibold mb-1">
        Thank you very much for taking your time to read this!
      </p>
      <div>
        <input type="checkbox" id="remember-me" onChange={toggleDontShowAgain} />
        <label htmlFor="remember-me" className="ml-2 font-semibold text-[15px]">Don't show this again</label>
      </div>
      <button className="signup-btn mt-3 m-auto block" onClick={continueToProject}>
        Continue
      </button>
    </PopUpWrapper>
  );
};

const TechnologyItem: React.FC<{ technology: TTechnologyItem }> = ({ technology }) => {
  return (
    <li className="flex items-center gap-2">
      <p>{technology.techName}</p>
      <img src={technology.image} alt="" className="w-[20px] h-[20px]" />
    </li>
  )
}

export default Welcome;