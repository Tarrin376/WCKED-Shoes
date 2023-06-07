import { useRef } from "react";
import { TOrderData } from "../../@types/TOrderData";
import Order from "./Order";
import { usePagination } from "../../hooks/usePagination";
import { TOrderOptions } from "../../@types/TOrderOptions";
import { orderOrders } from "../../utils/orderOrders";
import NoResultsFound from "../../components/NoResultsFound";
import { useWindowSize } from "../../hooks/useWindowSize";
import { orderFilters } from "../../utils/orderFilters";

const MyOrders = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const getOrders = usePagination<TOrderData, TOrderOptions>(orderOrders, 3, "/orders", "", "active", searchRef);
  const windowSize = useWindowSize();

  return (
    <>
      <h4 className="text-side-text-light dark:text-side-text-gray text-[18px] mb-[50px] max-md:text-[17px]">
        Your Account
        <span className="text-main-text-black dark:text-main-text-white">
          {" > Your Orders"}
        </span>
      </h4>
      <h1 className="text-2xl text-main-text-black dark:text-main-text-white mb-[30px]">
        Your Orders
      </h1>
      <div className="flex justify-between 2xl:items-center gap-[40px] max-2xl:gap-7 max-2xl:flex-col">
        {windowSize >= 618 ? 
        <ul className="flex w-[72%] max-2xl:w-full justify-between flex-grow text-main-text-black dark:text-main-text-white
        border-b border-light-border dark:border-main-gray-border">
          {Object.keys(orderFilters).map((filter: string, index: number) => {
            return (
              <li className={`nav-item pb-2 ${orderFilters[filter] === getOrders.filter ? `border-b-[3px] border-b-main-text-black 
              dark:border-b-main-text-white` : ""}`} key={index} onClick={() => getOrders.handleFilter(orderFilters[filter])}>
                {filter}
              </li>
            )
          })}
        </ul> : 
        <select className={`px-4 !rounded-[5px] light-component dark:gray-component cursor-pointer h-[50px] w-[250px] max-sm:!w-full md:w-fit 
        ${getOrders.loading ? "disabled-btn-light dark:disabled-btn" : ""}`}>
          {Object.keys(orderFilters).map((filter: string, index: number) => {
            return (
              <option key={index} value={orderFilters[filter]}>
                {filter}
              </option>
            )
          })}
        </select>}
        <div className="flex gap-4 2xl:w-[28%] max-2xl:max-w-[420px] max-md:max-w-full max-sm:flex-col">
          <input type="text" className="text-box-light dark:text-box flex-grow h-[39px]" placeholder="Search by order ID" ref={searchRef} />
          <button className={`secondary-btn w-[120px] h-[39px] ${getOrders.loading ? "dark:disabled-btn disabled-btn-light" : ""}`} 
          onClick={getOrders.handleSearch}>
            Search Orders
          </button>
        </div>
      </div>
      <div className="flex gap-[40px] mt-[40px] max-2xl:flex-col pb-1">
        <div className="flex gap-[40px] flex-col w-[72%] max-2xl:w-full">
          {getOrders.next.map((order: TOrderData) => {
            return <Order orderData={order} key={order.order_details.id} />
          })}
          {!getOrders.reachedLimit && !getOrders.loading && 
          <button className="m-auto block secondary-btn h-[40px] w-[180px]" 
          onClick={getOrders.handlePage}>
            Show More Orders
          </button>}
          <NoResultsFound 
            loading={getOrders.loading} 
            totalFound={getOrders.totalFound} 
            reachedLimit={getOrders.reachedLimit}
            title="No orders found here."
            message="If you are searching for an order, check that you entered the order ID correctly."
          />
        </div>
        <div className="light-component dark:gray-component overflow-hidden w-[28%] p-5 pt-3">
          <h4 className="text-[19px] mb-3 font-semibold">Buy it again</h4>
        </div>
      </div>
    </>
  )
};

export default MyOrders;