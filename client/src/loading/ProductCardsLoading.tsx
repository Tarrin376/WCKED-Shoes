import ProductCardLoading from "./ProductCardLoading";

interface Props {
  limit: number
}

const ProductCardsLoading: React.FC<Props> = ({ limit }) => {
  return (
    <>
      {new Array(limit).fill(0).map((_, index) => {
        return <ProductCardLoading key={index} />;
      })}
    </>
  )
};

export default ProductCardsLoading;