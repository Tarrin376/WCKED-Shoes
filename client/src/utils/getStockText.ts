
export const getStockText = (stock: number | undefined) => {
  if (!stock || stock === 0) {
    return {color: "dark:text-side-text-red text-[#F43C3C]", message: "Out of stock" };
  }
  
  if (stock <= 10) {
    return { color: "dark:text-limited-stock-orange text-[#fb8f1d]", message: `Only ${stock} left in stock` };
  } else {
    return {color: "dark:text-[#00D9B3] text-[#07A287]", message: "In stock" };
  }
}
