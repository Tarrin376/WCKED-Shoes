import { orderProducts } from "../../utils/orderProducts";
import ProductCards from "../../components/ProductCards";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { TProductOptions } from "../../@types/TProductOptions";
import OrderByOptions from "../../components/OrderByOptions";
import { usePagination } from "../../hooks/usePagination";
import { TProductCard } from "../../@types/TProductCard";

const productsLimit = 10;

const Home: React.FC<{}> = () => {
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const getProducts = usePagination<TProductCard, TProductOptions>(
    orderProducts, 
    productsLimit, 
    "/products", 
    location.state || "", 
    "", 
    undefined, 
    searchRef
  );

  return (
    <>
      <div className="flex max-lg:flex-col mt-[70px] lg:justify-between lg:items-center mb-[30px] gap-5 max-md:rounded-[8px]">
        <div className="flex gap-[20px] max-[495px]:gap-[15px] max-[495px]:flex-col max-[495px]:mb-[22px]">
          <input type="text" placeholder="Search for brand, colour, etc" 
          className="text-box-light light-component dark:gray-component dark:text-box lg:w-[400px] max-lg:flex-grow !px-4 h-[50px]" 
          ref={searchRef} />
          <button onClick={getProducts.handleSearch} className={`btn btn-primary max-[495px]:w-full w-[140px] h-[50px] text-base
          ${getProducts.loading ? "disabled-btn-light dark:disabled-btn" : ""}`}>
            Search
          </button>
        </div>
        <select className={`px-4 !rounded-md light-component dark:gray-component cursor-pointer h-[50px] max-md:w-full md:w-fit 
        ${getProducts.loading ? "disabled-btn-light dark:disabled-btn" : ""}`} 
        onChange={(e) => getProducts.handleSort(e.currentTarget.selectedIndex)}>
          <OrderByOptions options={orderProducts} />
        </select>
      </div>
      <ProductCards 
        getProducts={getProducts} 
        productsLimit={productsLimit} 
      />
    </>
  )
};

export default Home;
