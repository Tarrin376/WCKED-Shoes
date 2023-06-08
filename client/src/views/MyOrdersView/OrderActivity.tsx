import { convertDate } from "../../utils/convertDate";
import { TOrderActivty } from "../../@types/TOrderActivity";
import CheckIcon from "../../assets/check.png";

interface Props {
  dates: TOrderActivty[],
  estDelivery: string
}

const OrderActivity: React.FC<Props> = ({ dates, estDelivery }) => {
  return (
    <div className="p-3 mt-3 pb-0">
      <h4 className="text-[19px] mb-7 font-semibold">Order Activity</h4>
      <div className="flex flex-col">
        {dates.map((activity, index) => {
          return (
            <Status 
              activity={activity} 
              isLast={index === dates.length - 1} 
              key={index} 
              estDelivery={estDelivery} 
            />
          )
        })}
      </div>
    </div>
  )
};

const Status: React.FC<{ activity: TOrderActivty, isLast: boolean, estDelivery: string }> = ({ activity, isLast, estDelivery }) => {
  return (
    <div className={`pl-6 ml-2 ${!isLast ? "border-l border-light-border dark:border-main-gray-border border-dashed" : ""} h-[60px] relative`}>
      <div className="absolute top-[-16px]">
        <h5 className="text-main-text-black dark:text-main-text-white">{activity.label}</h5>
        <p className="text-[15px] text-side-text-light dark:text-side-text-gray">
          {activity.date !== "None" ? convertDate(activity.date, true) 
          : activity.label === "Processing" ? "Awaiting order confirmation" : estDelivery}
        </p>
      </div>
      <Check date={activity.date} />
    </div>
  )
}

const Check: React.FC<{ date: string }> = ({ date }) => {
  return (
    <div className={`outline outline-1 p-[2px] outline-offset-[-1px] outline-bg-primary-btn 
    ${date === "None" ? "bg-nav-light dark:bg-main-gray" : "bg-bg-primary-btn outline"}
    w-[18px] h-[18px] rounded-full absolute top-[-5px] left-[-9px]`}>
      {date !== "None" && <img src={CheckIcon} alt="" />}
    </div>
  )
}

export default OrderActivity;