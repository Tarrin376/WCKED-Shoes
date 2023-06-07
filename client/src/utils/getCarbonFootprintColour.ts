
export const getCarbonFootprintColour = (carbonFootprint: number) => {
  if (carbonFootprint <= 11) {
    return "dark:text-[#00D9B3] dark:bg-[#00ffd53d] text-[#07A287] bg-[#07A28714]";
  } else if (carbonFootprint <= 15 && carbonFootprint >= 10) {
    return "dark:text-[#ffa928] dark:bg-[#ff990036] text-[#fb8f1d] bg-[#FCA54914] ";
  } else {
    return "dark:text-[#FF4D4D] dark:bg-[#f43c3c4b] text-[#FF4B6E] bg-[#FF4B6E14]";
  }
}