
interface Props {
  error: string,
  styles?: string,
}

const ErrorMessage: React.FC<Props> = ({ error, styles }) => {
  return (
    <p className={`mt-7 text-center bg-main-red text-main-text-white rounded-[5px] p-2 ${styles}`}>
      {error}
    </p>
  )
};

export default ErrorMessage;