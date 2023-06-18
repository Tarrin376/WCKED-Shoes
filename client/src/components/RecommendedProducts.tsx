import { TProductCard } from "../@types/TProductCard";
import ProductCard from "./ProductCard";
import RecommendedWrapper from "../wrappers/RecommendedWrapper";
import { useGetRecommended } from "../hooks/useGetRecommended";
import ProductCardLoading from "../loading/ProductCardLoading";

interface Props {
  title: string,
  URL: string,
  styles?: string,
  column?: {
    fixedPosition: number,
    endFixedPosition: number,
    rightOffset: number
  },
}

const loadingProductCount = 20;

const RecommendedProducts: React.FC<Props> = ({ title, URL, styles, column }) => {
  const recommended = useGetRecommended(URL);

  if (recommended.products && recommended.products.length === 0) {
    return <></>
  }

  return (
    <RecommendedWrapper title={title} styles={styles} column={column}>
      <div className={column ? "flex flex-col items-center gap-[22px] w-[320px] h-[calc(100vh-140px)] overflow-y-scroll" : 
      "overflow-x-scroll whitespace-nowrap pb-6 w-full"}>
        {recommended.products ? recommended.products.map((product: TProductCard, index: number) => {
          return (
            <ProductCard 
              product={product} 
              styles={`inline-block ${index > 0 && !column ? "ml-[30px]" : ""}`}
              key={index}
              smallSize={true}
            />
          )
        }) : 
        new Array(loadingProductCount).fill(0).map((_, index: number) => {
          return (
            <ProductCardLoading 
              styles={`inline-block ${index > 0 && !column ? "ml-[30px]" : ""}`}
              key={index}
              smallSize={true}
              errorMessage={recommended.errorMessage}
            />
          )
        })}
      </div>
    </RecommendedWrapper>
  )
};

export default RecommendedProducts;