
export type TUsePagination<T1, T2> = {
  next: Readonly<T1[]>,
  totalFound: number,
  reachedLimit: boolean,
  errorMessage: string,
  loading: boolean,
  sort: T2,
  searchQuery: string,
  filter: string,
  handlePage: () => void,
  handleSort: (optionIndex: number) => void,
  handleSearch: () => void,
  handleFilter: (filter: string) => void
}