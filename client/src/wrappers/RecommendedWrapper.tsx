
interface Props {
  numProducts: number,
  title: string,
  styles?: string,
  children: React.ReactNode
}

const RecommendedWrapper: React.FC<Props> = ({ numProducts, title, styles, children }) => {
  return (
    <>
      {numProducts > 0 && 
      <div className={styles}>
        <h4 className="text-main-text-black dark:text-main-text-white text-[21px] mb-5 font-semibold">
          {title}
        </h4>
        {children}
      </div>}
    </>
  )
};

export default RecommendedWrapper;