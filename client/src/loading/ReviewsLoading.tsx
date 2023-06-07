import ReviewLoading from "./ReviewLoading";

interface Props {
  limit: number
}

const ReviewsLoading: React.FC<Props> = ({ limit }) => {
  return (
    <div className="flex flex-col gap-6 mt-2">
      {new Array(limit).fill(0).map((_, i) => {
        return <ReviewLoading key={i} />
      })}
    </div>
  )
};

export default ReviewsLoading;