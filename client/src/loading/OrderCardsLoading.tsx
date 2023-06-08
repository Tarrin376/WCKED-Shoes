import OrderCardLoading from "./OrderCardLoading";

const orderLimit = 3;

const OrderCardsLoading = () => {
  return (
    <>
      {new Array(orderLimit).fill(0).map((_, index) => {
        return <OrderCardLoading key={index} />
      })}
    </>
  )
};

export default OrderCardsLoading;