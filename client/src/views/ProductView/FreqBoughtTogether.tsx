import { useGetRecommended } from "../../hooks/useGetRecommended";
import { TProductCard } from "../../@types/TProductCard";
import RecommendedWrapper from "../../wrappers/RecommendedWrapper";
import ProductCard from "../../components/ProductCard";
import AddLightIcon from "../../assets/add-light.png";
import AddDarkIcon from "../../assets/add-dark.png";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";

interface Props {
  URL: string,
  styles?: string,
  addToCart: () => Promise<boolean>
}

const amounts = ["", "", "both", "all three"];

const FreqBoughtTogether: React.FC<Props> = ({ URL, styles, addToCart }) => {
  const recommended: TProductCard[] | undefined = useGetRecommended(URL);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<TProductCard[]>([]);
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const total = !recommended ? 0 : recommended.reduce((acc: number, cur: TProductCard) => acc + cur.price, 0);
    setTotalPrice(total);

    if (recommended) {
      setCheckedItems(recommended);
    }
  }, [recommended]);

  if (!recommended) {
    return <></>
  }
  
  const addItemsToBasket = () => {
    console.log(checkedItems);
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
                checkbox={true} 
                setTotalPrice={setTotalPrice}
                smallSize={true}
                setCheckedItems={setCheckedItems}
              /> :
              <img src={themeContext?.darkMode ? AddDarkIcon : AddLightIcon} 
              className="w-[23px] h-[23px]" alt="" />}
            </div>
          )
        })}
        {checkedItems.length > 0 && <div className="ml-2 flex flex-col items-center gap-2">
          <p className="text-main-text-black dark:text-main-text-white">
            Total Price:
            <span className="text-[18px] font-semibold ml-2">{`£${totalPrice.toFixed(2)}`}</span>
          </p>
          <button className="btn-primary text-base w-[250px] h-[35px]" onClick={addItemsToBasket}>
            {`Add ${amounts[checkedItems.length]} to bag`}
          </button>
        </div>}
      </div>}
    </RecommendedWrapper>
  )
};

export default FreqBoughtTogether;
