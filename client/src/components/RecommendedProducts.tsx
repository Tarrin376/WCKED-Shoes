import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { TProductCard } from "../@types/TProductCard";
import ProductCard from "./ProductCard";
import RecommendedWrapper from "../wrappers/RecommendedWrapper";
import { useGetRecommended } from "../hooks/useGetRecommended";

interface Props {
  title: string,
  URL: string,
  styles?: string,
}

const RecommendedProducts: React.FC<Props> = ({ title, URL, styles }) => {
  const recommended: TProductCard[] | undefined = useGetRecommended(URL);

  if (!recommended) {
    return <p>loading</p>
  }

  return (
    <RecommendedWrapper numProducts={recommended.length} title={title} styles={styles}>
      <div className="overflow-x-scroll whitespace-nowrap pb-5 w-fit">
        {recommended.map((product: TProductCard, index: number) => {
          return (
            <ProductCard 
              product={product} 
              styles={`inline-block ${index > 0 ? "ml-[30px]" : ""}`}
              key={index}
            />
          )
        })}
      </div>
    </RecommendedWrapper>
  )
};
export default RecommendedProducts;
