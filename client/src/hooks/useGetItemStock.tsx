import { useState, useEffect, useCallback } from "react";
import { TSizeStock } from "../@types/TSizeStock";
import { TSize } from "../@types/TSize";
import { getStockText } from "../utils/getStockText";

const useGetItemStock = (curSize: TSize | undefined) => {
  const [stock, setStock] = useState<TSizeStock>();

  const getItemStock = useCallback((): TSizeStock => {
    const stockText = getStockText(curSize && curSize.stock);
    return stockText;
  }, [curSize]);
  
  useEffect(() => {
    const stock = getItemStock();
    setStock(stock);
  }, [curSize, getItemStock])

  return stock;
};

export default useGetItemStock;
