import { TSize } from "../../@types/TSize";

interface Props {
  sizes: readonly TSize[],
  curSize: TSize | undefined,
  updateShoeSize: (size: TSize) => void
}

const Sizes: React.FC<Props> = ({ sizes, curSize, updateShoeSize }) => {
  return (
    <div className="flex flex-wrap gap-[11px] mb-3">
      {sizes.map((cur: TSize, index) => {
        return (
          <div className={`flex select-none items-center justify-center outline outline-[1px] outline-main-text-black 
          dark:outline-[#6F6F6F] w-[70px] h-[30px] rounded-md cursor-pointer
          ${cur.stock === 0 ? "opacity-30 pointer-events-none outline-light-border dark:outline-[#6F6F6F] bg-transparent" : ""}
          transition ease-linear duration-100 ${curSize && cur.size === curSize.size ? 
            "bg-main-text-white dark:bg-main-gray outline-[2px]" : "dark:hover:bg-main-gray hover:outline-[2px]"}`} key={index}
          onClick={() => updateShoeSize(cur)}>
            <p className="text-side-text-light dark:text-side-text-gray">{cur.size}</p>
          </div>
        )
      })}
    </div>
  )
};

export default Sizes;
