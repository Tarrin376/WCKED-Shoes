import { useScrollPosition } from "../hooks/useScrollPosition";

interface Props {
  numProducts: number,
  title: string,
  styles?: string,
  children: React.ReactNode,
  column?: {
    fixedPosition: number,
    endFixedPosition: number,
    rightOffset: number
  }
}

const RecommendedWrapper: React.FC<Props> = ({ numProducts, title, styles, children, column }) => {
  const scrollPosition = useScrollPosition();
  const curBottomPos = document.body.scrollHeight - (!column ? -1 : column.endFixedPosition);

  return (
    <>
      {numProducts > 0 && 
      <div className={`pt-5 border-t border-light-border dark:border-main-gray-border ${styles}`} 
      style={column && scrollPosition.top >= column.fixedPosition && scrollPosition.bottom < curBottomPos ? 
      {right: `${column.rightOffset}px`, position: "fixed", top: "32px"} : scrollPosition.bottom >= curBottomPos ? 
      {position: "absolute", bottom: "0", right: "0"} : {paddingBottom: "1.25rem"}}>
        <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-5 font-semibold">
          {title}
        </h4>
        {children}
      </div>}
    </>
  )
};

export default RecommendedWrapper;