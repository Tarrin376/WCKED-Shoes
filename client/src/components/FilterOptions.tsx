
interface Props {
  options: {
    [key: string]: string
  },
  handleFilter: (filter: string) => void,
  styles?: string
}

export const FilterOptions: React.FC<Props> = ({ options, handleFilter, styles }) => {
  return (
    <select onChange={(e) => handleFilter(e.target.value)} className={styles}>
      {Object.keys(options).map((filter: string, index: number) => {
        return (
          <option key={index} value={options[filter]}>
            {filter}
          </option>
        )
      })}
    </select>
  )
};
