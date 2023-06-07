import { TProductCard } from "../@types/TProductCard";
import ProductCard from "./ProductCard";
import RecommendedWrapper from "../wrappers/RecommendedWrapper";
import { useGetRecommended } from "../hooks/useGetRecommended";

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

const RecommendedProducts: React.FC<Props> = ({ title, URL, styles, column }) => {
  const recommended: TProductCard[] | undefined = useGetRecommended(URL);

  if (!recommended) {
    return <></>
  }

  return (
    <RecommendedWrapper numProducts={recommended.length} title={title} styles={styles} column={column}>
      <div className={column ? "flex flex-col items-center gap-[22px] w-[320px] h-[calc(100vh-140px)] overflow-y-scroll" : 
      "overflow-x-scroll whitespace-nowrap pb-5 w-full"}>
        {recommended.map((product: TProductCard, index: number) => {
          return (
            <ProductCard 
              product={product} 
              styles={`inline-block ${index > 0 && !column ? "ml-[30px]" : ""}`}
              key={index}
              smallSize={true}
            />
          )
        })}
      </div>
    </RecommendedWrapper>
  )
};

export default RecommendedProducts;