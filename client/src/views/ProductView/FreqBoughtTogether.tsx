import { useGetRecommended } from "../../hooks/useGetRecommended";
import RecommendedWrapper from "../../wrappers/RecommendedWrapper";
import ProductCard from "../../components/ProductCard";
import AddLightIcon from "../../assets/add-light.png";
import AddDarkIcon from "../../assets/add-dark.png";
import { useContext, useState } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import { TCheckedItem } from "../../@types/TCheckedItem";
import { TProduct } from "../../@types/TProduct";
import Button from "../../components/Button";
import ProductCardLoading from "../../loading/ProductCardLoading";
import { getAPIErrorMessage } from "../../utils/getAPIErrorMessage";
import { AxiosError } from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import { TErrorMessage } from "../../@types/TErrorMessage";

interface Props {
  product: TProduct,
  curSize: string,
  addToCart: (productId: number, size: string | undefined) => Promise<TErrorMessage | undefined>,
  styles?: string,
}

const FreqBoughtTogether: React.FC<Props> = ({ product, curSize, addToCart, styles }) => {
  const recommended = useGetRecommended(`/products/${product.id}/freq-bought-together?limit=${2}`);
  const [totalPrice, setTotalPrice] = useState<number>(product.price);
  const [checkedItems, setCheckedItems] = useState<Readonly<TCheckedItem[]>>([]);
  const themeContext = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const addItemsToCart = async (): Promise<TErrorMessage | undefined> => {
    try {
      const addProductResponse = await addToCart(product.id, curSize);
      if (addProductResponse) {
        return addProductResponse;
      }

      for (let item of checkedItems) {
        if (item.size !== "") {
          const response = await addToCart(item.productId, item.size);
          if (response) {
            return response;
          }
        }
      }
    }
    catch (error: any) {
      const errorMsg = getAPIErrorMessage(error as AxiosError);
      return errorMsg;
    }
  }

  if (recommended.products && recommended.products.length === 0) {
    return <></>
  }

  return (
    <RecommendedWrapper title="Frequently bought together" styles={styles}>
      <div className="flex items-center gap-5 max-xl:flex-col">
        <div className="flex items-center gap-3 flex-wrap justify-center max-sm:flex-col">
          {new Array(2 * (recommended.products ? recommended.products.length : 3) - 1).fill(0).map((_, index) => {
            return (
              <div key={index}>
                {index % 2 === 0 ?
                  recommended.products ? 
                  <ProductCard 
                    product={recommended.products![index / 2]} 
                    setTotalPrice={setTotalPrice}
                    smallSize={true}
                    setCheckedItems={setCheckedItems}
                    dropdown={index > 0}
                  /> :
                  <ProductCardLoading 
                    smallSize={true} 
                    errorMessage={recommended.errorMessage} 
                  />
                : <img src={themeContext?.darkMode ? AddDarkIcon : AddLightIcon} 
                className="w-[23px] h-[23px]" alt="" />}
              </div>
            )
          })}
        </div>
        {totalPrice > 0 && 
        <div className="ml-2 flex flex-col items-center gap-2 max-xl:pb-2">
          <p className="text-main-text-black dark:text-main-text-white">
            Total Price:
            <span className="text-[18px] font-semibold ml-2">
              {`£${recommended.products ? totalPrice.toFixed(2) : 0}`}
            </span>
          </p>
          <Button 
            action={addItemsToCart} 
            completedText="Items added to bag" 
            defaultText={`Add ${checkedItems.length + 1 === 1 ? "" : checkedItems.length + 1 === 2 ? "both" : "all three"} to bag`}
            loadingText={"Adding items to bag"} 
            styles={"btn-primary text-base w-[250px] h-[35px]"}
            setErrorMessage={setErrorMessage}
          />
          {errorMessage && <ErrorMessage error={errorMessage.message} styles="mt-[7px] w-[250px]" />}
        </div>}
      </div>
    </RecommendedWrapper>
  )
};

export default FreqBoughtTogether;
