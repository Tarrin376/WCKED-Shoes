import { useGetRecommended } from "../../hooks/useGetRecommended";
import { TProductCard } from "../../@types/TProductCard";
import RecommendedWrapper from "../../wrappers/RecommendedWrapper";
import ProductCard from "../../components/ProductCard";
import AddLightIcon from "../../assets/add-light.png";
import AddDarkIcon from "../../assets/add-dark.png";
import { useContext, useState } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import { TCheckedItem } from "../../@types/TCheckedItem";
import { TProduct } from "../../@types/TProduct";

interface Props {
  product: TProduct,
  curSize: string,
  addToCart: (productId: number, size: string) => Promise<boolean>,
  styles?: string,
}

const amounts = ["", "", "both", "all three"];

const FreqBoughtTogether: React.FC<Props> = ({ product, curSize, addToCart, styles }) => {
  const recommended: TProductCard[] | undefined = useGetRecommended(`/products/${product.id}/freq-bought-together?limit=${2}`);
  const [totalPrice, setTotalPrice] = useState<number>(product.price);
  const [checkedItems, setCheckedItems] = useState<Readonly<TCheckedItem[]>>([{ productId: product.id, size: curSize }]);
  const themeContext = useContext(ThemeContext);
  
  const addItemsToCart = async () => {
    try {
      for (let item of checkedItems) {
        if (item.size !== "") {
          await addToCart(item.productId, item.size);
        }
      }
    }
    catch (error: any) {
      console.log(error);
    }
  }

  if (!recommended) {
    return <></>
  }

  return (
    <RecommendedWrapper numProducts={recommended.length} title="Frequently bought together" styles={styles}>
      {recommended.length > 0 && 
      <div className="flex items-center gap-3">
        {new Array(2 * recommended.length - 1).fill(0).map((_, index) => {
          return (
            <div key={index}>
              {index % 2 === 0 ? 
              <ProductCard 
                product={recommended[index / 2]} 
                setTotalPrice={setTotalPrice}
                smallSize={true}
                setCheckedItems={setCheckedItems}
                dropdown={index > 0}
              /> :
              <img src={themeContext?.darkMode ? AddDarkIcon : AddLightIcon} 
              className="w-[23px] h-[23px]" alt="" />}
            </div>
          )
        })}
        {totalPrice > 0 && <div className="ml-2 flex flex-col items-center gap-2">
          <p className="text-main-text-black dark:text-main-text-white">
            Total Price:
            <span className="text-[18px] font-semibold ml-2">{`£${totalPrice.toFixed(2)}`}</span>
          </p>
          <button className="btn-primary text-base w-[250px] h-[35px]" onClick={addItemsToCart}>
            {`Add ${amounts[checkedItems.length]} to bag`}
          </button>
        </div>}
      </div>}
    </RecommendedWrapper>
  )
};

export default FreqBoughtTogether;
