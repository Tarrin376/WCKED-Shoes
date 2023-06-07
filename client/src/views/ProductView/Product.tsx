import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { TProduct } from "../../@types/TProduct";
import axios, { AxiosError } from "axios";
import { popularSoldCount } from "../../components/ProductCard";
import DarkCartIcon from "../../assets/cart-dark.png";
import { UserContext } from "../../providers/UserProvider";
import Reviews from "./Reviews";
import BackArrow from "../../assets/back-arrow.png";
import NextArrow from "../../assets/next-arrow.png";
import WriteReview from "./WriteReview";
import ProductDetails from "./ProductDetails";
import Rating from "../../components/Rating";
import Sizes from "./Sizes";
import { TSize } from "../../@types/TSize";
import ProductLoading from "../../loading/ProductLoading";
import Button from "../../components/Button";
import { TUser } from "../../@types/TUser";
import useGetItemStock from "../../hooks/useGetItemStock";
import ErrorMessage from "../../components/ErrorMessage";
import { getCarbonFootprintColour } from "../../utils/getCarbonFootprintColour";
import { quantityLimit } from "../CartView/CartItem";
import RecommendedProducts from "../../components/RecommendedProducts";
import { useNavigate } from "react-router-dom";
import FreqBoughtTogether from "./FreqBoughtTogether";

interface ProductImagesProps {
  images: readonly string[], 
  selectedImage: number | undefined, 
  updateSelectedImage: (imageIndex: number) => void
}

const defaultText = "Add to bag";
const loadingText = "Adding to bag...";
const completedText = "Added to bag";

const boughtTogetherLimit = 3;
const customerBoughtLimit = 20;

const Product: React.FC<{}> = () => {
  const location = useLocation();
  const [product, setProduct] = useState<Readonly<TProduct | null>>(null);
  const userContext = useContext(UserContext);
  const [curSize, setCurSize] = useState<TSize>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const itemStock = useGetItemStock(curSize);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  const boughtTogetherEndpoint = `/products/${product?.id}/freq-bought-together?limit=${boughtTogetherLimit}`;
  const customerBoughtEndpoint = `/products/${product?.id}/recommend-customer-bought?limit=${customerBoughtLimit}`

  const updateShoeSize = (size?: TSize) => {
    if (size) {
      setCurSize(size);
    }
  }

  const updateSelectedImage = (imageIndex: number) => {
    setSelectedImage(imageIndex);
  }

  const updateItemQuantity = (value: number) => {
    setQuantity((cur) => Math.max(1, Math.min(cur + value, quantityLimit)));
  }

  const addToCart = async (): Promise<boolean> => {
    const inStock = await checkItemStock(curSize!.size);
    if (!inStock || !curSize) {
      return false;
    }

    try {
      const response = await axios.post<TUser>(`/users/cart/${product!.id}/${curSize!.size}/${quantity}`);
      userContext?.setUserData((cur) => {
        return {
          ...cur,
          cartChanged: true,
          email: response.data.email,
        }
      });

      setQuantity(1);
      return true;
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response!.data);
      } else {
        setErrorMessage(error.message);
      }
      
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    }
  }

  const checkItemStock = async (size: string): Promise<boolean> => {
    try {
      const stockResponse = await axios.get<{ inStock: boolean }>(`/products/${product!.id}/${size}`);
      return stockResponse.data.inStock;
    }
    catch (error: any) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response!.data);
      } else {
        setErrorMessage(error.message);
      }
      
      return false;
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const productResponse = await axios.get<TProduct>(location.pathname);
        if (productResponse.status === 200) {
          const size = productResponse.data.sizes.find((cur: TSize) => cur.stock > 0);
          setProduct({...productResponse.data, images: [productResponse.data.thumbnail, ...productResponse.data.images] });
          setCurSize(size);
          setSelectedImage(0);
        }
      }
      catch (error: any) {
        if (error instanceof AxiosError) {
          if (error.response!.status === 404) {
            navigate("/error", { state: { error: error.response!.data }});
          }
        }
      }
    })()
  }, [location.pathname, navigate]);

  if (!product) {
    return <ProductLoading />
  }

  return (
    <>
      <h4 className="text-side-text-light dark:text-side-text-gray text-[18px] mb-[70px] max-md:text-[17px]">
        {"Home > Products > "}
        <span className="text-main-text-black dark:text-main-text-white">
          {product.name}
        </span>
      </h4>
      <div className="flex max-xl:flex-col w-full gap-7 mb-[62px]">
        <div className="flex max-2xl:flex-col-reverse items-center xl:w-2/3 max-xl:w-full gap-6">
          <div className="max-2xl:whitespace-nowrap max-2xl:w-full 2xl:pr-12 2xl:py-6 2xl:h-[540px] 
          max-2xl:h-fit max-2xl:pb-4 2xl:overflow-y-scroll max-2xl:overflow-x-scroll max-2xl:overflow-y-hidden max-lg:hidden">
            <ProductImages 
              images={product.images}
              selectedImage={selectedImage} updateSelectedImage={updateSelectedImage}
            />
          </div>
          <div className="w-full h-[540px] max-xl:h-[600px] max-lg:h-[400px] max-md:h-[300px] max-sm:h-[245px] bg-center bg-cover rounded-[8px] relative 
          shadow-light-component-shadow dark:shadow-gray-component-shadow border border-light-border dark:border-main-gray-border"
          style={{backgroundImage: `url(${product.images[selectedImage]})`}}>
            <div className="absolute lg:bottom-6 lg:right-6 max-lg:bottom-4 max-lg:right-4 flex gap-3">
              <button className="w-[40px] h-[40px] rounded-full bg-no-reviews-bg shadow-light-component-shadow"
              onClick={() => updateSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}>
              <img src={BackArrow} className="w-[19px] h-[19px] block m-auto" alt="back" />
              </button>
              <button className="w-[40px] h-[40px] rounded-full bg-no-reviews-bg shadow-light-component-shadow"
              onClick={() => updateSelectedImage((selectedImage + 1) % product.images.length)}>
                <img src={NextArrow} className="w-[19px] h-[19px] block m-auto" alt="next" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/3 max-xl:w-full xl:h-[540px] bg-transparent xl:px-6">
          <div className="mb-4 flex gap-3">
            {product.num_sold >= popularSoldCount && <p className="best-seller text-base h-fit py-1 max-sm:text-[15px]">Best Seller</p>}
            <p className={`${getCarbonFootprintColour(product.carbon_footprint)} best-seller text-base h-fit py-1 max-sm:text-[15px]`}>
              {`${product.carbon_footprint} kg CO2E`}
            </p>
          </div>
          <h1 className="text-main-text-black dark:text-main-text-white md:text-4xl max-md:text-3xl max-sm:text-[26px] mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 text-side-text-light dark:text-side-text-gray w-fit justify-between mb-5">
            <Rating rating={product.rating} />
            <div className="w-[1px] h-[15px] bg-light-border dark:bg-line-gray"></div>
            <p className="text-[15px]">{`${product.num_reviews} ${product.num_reviews === 1 ? 'review' : 'reviews'}`}</p>
            <div className="w-[1px] h-[15px] bg-light-border dark:bg-line-gray"></div>
            <p className="text-[15px]">{`${product.num_sold} sold`}</p>
          </div>
          <div className="flex gap-5 items-center mb-6">
            <p className="text-side-text-light dark:text-side-text-gray text-2xl max-sm:text-[22px]">£{product.price}</p>
            <p className={itemStock?.color}>{itemStock?.message}</p>
          </div>
          {product.sizes && <Sizes sizes={product.sizes} curSize={curSize} updateShoeSize={updateShoeSize} />}
          {errorMessage.length > 0 && <ErrorMessage error={errorMessage} styles="w-fit px-3" />}
          <div className="mt-7 flex gap-5">
            <Button action={addToCart} completedText={completedText} defaultText={defaultText} loadingText={loadingText} 
            styles={`btn-primary h-[48px] w-[180px] flex items-center justify-center gap-4 px-4
            ${!curSize || userContext?.email === "" ? 'disabled-btn-light dark:disabled-btn' : ''}`}>
              <img src={DarkCartIcon} className="w-[23px] h-[23px]" alt="" />
            </Button>
            <div className="flex w-[140px] h-[48px] border border-light-border dark:border-[#6F6F6F] shadow-light-component-shadow 
            dark:shadow-gray-component-shadow btn items-center justify-between p-4 pb-[17px]">
              <button className="text-main-text-black dark:text-main-text-white font-bold text-[23px]" onClick={() => updateItemQuantity(-1)}>-</button>
              <p className="font-semibold text-[17px] text-main-text-black dark:text-main-text-white">{quantity}</p>
              <button className="text-main-text-black dark:text-main-text-white font-bold text-[23px]" onClick={() => updateItemQuantity(1)}>+</button>
            </div>
          </div>
        </div>
      </div>
      <ProductDetails product={product} />
      <FreqBoughtTogether 
        URL={boughtTogetherEndpoint} 
        styles="pb-8 border-y border-light-border dark:border-main-gray-border pt-5"
      />
      <RecommendedProducts 
        title="Customers who bought this item also bought" 
        URL={customerBoughtEndpoint}
        styles="mt-5 mb-[70px]"
      />
      
      <div className="flex max-xl:flex-col gap-6 max-xl:h-fit max-2xl:h-[630px] pb-2">
        <Reviews product={product} />
        <WriteReview product={product} />
      </div>
    </>
  )
};

const ProductImages: React.FC<ProductImagesProps> = ({ images, selectedImage, updateSelectedImage }) => {
  return (
    <>
      {images.map((image, index) => {
        return (
          <div className={`w-[127px] h-[127px] rounded-[8px] bg-center bg-cover max-2xl:inline-block cursor-pointer border 
          border-light-border dark:border-main-gray-border
          ${index > 0 ? "2xl:mt-6" : ""} ${index < images.length - 1 ? "max-2xl:mr-6" : ""}
          ${index === selectedImage ? "border !border-main-text-black dark:border-search-border" : ""}`}
          key={index} style={{backgroundImage: `url(${image})`}} onClick={() => updateSelectedImage(index)}>
          </div>
        )
      })}
    </>
  )
}

export default Product;
