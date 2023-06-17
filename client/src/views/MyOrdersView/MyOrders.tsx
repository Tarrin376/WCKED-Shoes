import { useRef, useEffect, useContext, useState } from "react";
import { TOrderData } from "../../@types/TOrderData";
import Order from "./Order";
import { usePagination } from "../../hooks/usePagination";
import { TOrderOptions } from "../../@types/TOrderOptions";
import { orderOrders } from "../../utils/orderOrders";
import NoResultsFound from "../../components/NoResultsFound";
import { useWindowSize } from "../../hooks/useWindowSize";
import { orderFilters } from "../../utils/orderFilters";
import RecommendedProducts from "../../components/RecommendedProducts";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { getPageSize } from "../../utils/getPageSize";
import OrderCardsLoading from "../../loading/OrderCardsLoading";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";
import { useGetRecommended } from "../../hooks/useGetRecommended";

const MyOrders = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const getOrders = usePagination<TOrderData, TOrderOptions>(orderOrders, 3, "/api/orders", "", "active", searchRef);
  const windowSize = useWindowSize();
  const scrollPosition = useScrollPosition();
  const pageSize = getPageSize(windowSize);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const buyItAgainURL = `/api/users/buy-it-again?limit=${20}`;
  const recommended = useGetRecommended(buyItAgainURL);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!userContext?.email) {
      navigate("/");
    } else if (getOrders.errorMessage) {
      navigate("/error", { state: { error: getOrders.errorMessage.message } });
    }

    window.scrollTo(0, 0);
  }, [getOrders.errorMessage, navigate, userContext?.email])

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
        <ul className="flex max-2xl:w-full justify-between flex-grow text-main-text-black dark:text-main-text-white
        border-b border-light-border dark:border-main-gray-border">
          {Object.keys(orderFilters).map((filter: string, index: number) => {
            return (
              <li className={`nav-item pb-[14px] ${orderFilters[filter] === getOrders.filter ? `border-b-[3px] border-b-main-text-black 
              dark:border-b-main-text-white` : ""}`} key={index} onClick={() => getOrders.handleFilter(orderFilters[filter])}>
                {filter}
              </li>
            )
          })}
        </ul> :
        <select className={`px-4 !rounded-md light-component dark:gray-component cursor-pointer h-[50px] w-[250px] max-sm:!w-full md:w-fit 
        ${getOrders.loading ? "disabled-btn-light dark:disabled-btn" : ""}`} onChange={(e) => getOrders.handleFilter(e.target.value)}>
          {Object.keys(orderFilters).map((filter: string, index: number) => {
            return (
              <option key={index} value={orderFilters[filter]}>
                {filter}
              </option>
            )
          })}
        </select>}
        <div className="flex gap-4 2xl:w-[320px] max-2xl:max-w-[420px] max-md:max-w-full max-sm:flex-col">
          <input type="text" className="text-box-light dark:text-box sm:w-[60%] h-[39px]" placeholder="Search by order ID" ref={searchRef} />
          <button className={`secondary-btn sm:w-[40%] h-[39px] ${getOrders.loading ? "dark:disabled-btn disabled-btn-light" : ""}`} 
          onClick={getOrders.handleSearch}>
            Find Order
          </button>
        </div>
      </div>
      <div className="flex gap-[40px] justify-between mt-[40px] max-2xl:flex-col pb-1 relative 2xl:min-h-[100vh]">
        <div className={`flex gap-[25px] flex-col max-2xl:w-full ${scrollPosition.top >= 345 && windowSize >= 1518 && recommended.products &&
        recommended.products.length > 0 ? 
          "w-[calc(100%-320px-40px)]" : "flex-grow"}`}>
          {getOrders.next.map((order: TOrderData) => {
            return (
              <Order 
                orderData={order} 
                key={order.order_details.id}
                setNext={getOrders.setNext}
                disabled={disabled}
                setDisabled={setDisabled}
              />
            )
          })}
          {getOrders.loading && <OrderCardsLoading />}
          {!getOrders.reachedLimit && !getOrders.loading && 
          <button className="m-auto block secondary-btn h-[40px]" 
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
        <RecommendedProducts 
          title={"Buy it again"} 
          URL={buyItAgainURL} 
          column={windowSize >= 1518 ? {
            fixedPosition: 345,
            endFixedPosition: 523,
            rightOffset: ((windowSize - pageSize) / 2) + 18,
          } : undefined}
        />
      </div>
    </>
  )
};

export default MyOrders;