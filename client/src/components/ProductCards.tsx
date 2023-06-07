import ProductCard from "./ProductCard";
import { TProductCard } from "../@types/TProductCard";
import ProductCardsLoading from "../loading/ProductCardsLoading";
import { TUsePagination } from "../@types/TUsePagination";
import { TOrderByOption } from "../@types/TOrderByOption";
import { TProductOptions } from "../@types/TProductOptions";
import NoResultsFound from "./NoResultsFound";

interface Props {
  getProducts: TUsePagination<TProductCard, TOrderByOption<TProductOptions>>,
  productsLimit: number
}

const ProductCards: React.FC<Props> = ({ getProducts, productsLimit }) => {
  const getResultsTitle = () => {
    if (getProducts.loading) {
      if (getProducts.searchQuery === "") return `Finding products...`;
      else return `Finding products for '${getProducts.searchQuery}'...`;
    } else if (getProducts.totalFound === 1) {
      if (getProducts.searchQuery === "") return `1 product found`;
      else return `1 product found for '${getProducts.searchQuery}'`;
    } else {
      if (getProducts.searchQuery === "") return `${getProducts.totalFound} products found`;
      else return `${getProducts.totalFound} products found for '${getProducts.searchQuery}'`;
    }
  }

  return (
    <>
      <h2 className="text-main-text-black dark:text-main-text-white text-2xl">{getResultsTitle()}</h2>
      <div className={`mt-[30px] flex flex-wrap gap-[35px] max-md:justify-center ${getProducts.loading ? "mb-[50px]" : ""}`}>
        {getProducts.next.map((product: Readonly<TProductCard>) => {
          return <ProductCard key={product.id} product={product} />
        })}
        {getProducts.loading && <ProductCardsLoading limit={productsLimit} />}
      </div>
      <NoResultsFound 
        loading={getProducts.loading} 
        totalFound={getProducts.totalFound} 
        reachedLimit={getProducts.reachedLimit}
        title="Sorry, we can't seem to find what you are looking for."
        message="Try checking your spelling or use more general terms."
      />
      {!getProducts.reachedLimit && !getProducts.loading && 
      <button className="m-auto block mt-[50px] mb-[50px] secondary-btn h-[40px] w-[180px]" 
      onClick={getProducts.handlePage}>
        Show More Products
      </button>}
    </>
  )
};

export default ProductCards;