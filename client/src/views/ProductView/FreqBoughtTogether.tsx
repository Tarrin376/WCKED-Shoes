import { useGetRecommended } from "../../hooks/useGetRecommended";
import { TProductCard } from "../../@types/TProductCard";
import RecommendedWrapper from "../../wrappers/RecommendedWrapper";

interface Props {
  URL: string,
  styles?: string
}

const FreqBoughtTogether: React.FC<Props> = ({ URL, styles }) => {
  const recommended: TProductCard[] | undefined = useGetRecommended(URL);

  if (!recommended) {
    return <p>loading</p>
  }

  return (
    <RecommendedWrapper numProducts={recommended.length} title="Frequently bought together" styles={styles}>
      
    </RecommendedWrapper>
  )
};

export default FreqBoughtTogether;
