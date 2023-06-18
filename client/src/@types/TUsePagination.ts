import { TErrorMessage } from "./TErrorMessage"

export type TUsePagination<T1, T2> = {
  next: T1[],
  totalFound: number,
  reachedLimit: boolean,
  errorMessage: TErrorMessage | undefined,
  loading: boolean,
  sort: T2,
  searchQuery: string,
  filter: string,
  handlePage: () => void,
  handleSort: (optionIndex: number) => void,
  handleSearch: () => void,
  handleFilter: (filter: string) => void,
  resetState: () => void,
}