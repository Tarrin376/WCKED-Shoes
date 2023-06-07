
interface Props {
  loading: boolean,
  totalFound: number,
  reachedLimit: boolean,
  title: string,
  message: string
}

const NoResultsFound: React.FC<Props> = ({ loading, totalFound, reachedLimit, title, message }) => {
  return (
    <div>
      {totalFound === 0 && !loading ? 
      <>
        <p className="text-center mt-[50px] text-2xl mb-[10px] text-main-text-black dark:text-main-text-white">
          {title}
        </p>
        <p className="text-side-text-light dark:text-side-text-gray text-center mb-[50px]">
          {message}
        </p>
      </>
      : reachedLimit &&
      <p className="text-center mt-[50px] mb-[50px] dark:text-side-text-gray text-side-text-light">
        You've reached the end of the list
      </p>}
    </div>
  )
};

export default NoResultsFound;