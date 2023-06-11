import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { TOrderByOption } from "../@types/TOrderByOption";
import { TUsePagination } from "../@types/TUsePagination";
import { TPaginationMetaData } from "../@types/TPaginationMetaData";
import { getAPIErrorMessage } from "../utils/getAPIErrorMessage";
import { TErrorMessage } from "../@types/TErrorMessage";

export const usePagination = <T1, T2>(orderBy: readonly TOrderByOption<T2>[], limit: number, URL: string, 
  initialSearch: string, initialFilter: string, searchRef?: React.RefObject<HTMLInputElement>)
  : TUsePagination<T1, TOrderByOption<T2>> => {
  
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState<TOrderByOption<T2>>(orderBy[0]);
  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<T1[]>([]);
  const [reachedLimit, setReachedLimit] = useState<boolean>(false);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<TErrorMessage>();

  const queryURL = `${URL}?search=${searchQuery}&filter=${filter}&sort=${sort.orderBy}&page=${page}&limit=${limit}&asc=${sort.order === "asc"}`;

  const handlePage = () => {
    if (!reachedLimit && !loading) {
      setPage((curPage) => curPage + 1);
    }
  }

  const handleSort = (optionIndex: number) => {
    const option: TOrderByOption<T2> = orderBy[optionIndex];
    setSort(option);
    resetState();
  }

  const handleSearch = () => {
    if (!searchRef || !searchRef.current) {
      return;
    }

    const query: string = searchRef.current.value.trim();
    setSearchQuery(query);
    resetState();
  }

  const handleFilter = (filter: string) => {
    if (!loading) {
      setSearchQuery("");
      setFilter(filter);
      resetState();
    }
  }

  const resetState = () => {
    setReachedLimit(false);
    setNext([]);
    setPage(1);
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      (async () => {
        try {
          const response = await axios.get<{ meta: TPaginationMetaData, next: T1[] }>(queryURL);
          if (response.status === 200) {
            setNext((state) => [...state, ...response.data.next]);
            setTotalFound(response.data.meta.total_count);
            setErrorMessage(undefined);
            
            if (!response.data.meta.has_next) {
              setReachedLimit(true);
            }
          }
        }
        catch (error: any) {
          const errorMsg = getAPIErrorMessage(error as AxiosError);
          setErrorMessage(errorMsg);
        }
        finally {
          setLoading(false);
        }
      })()
    }, 700);
  }, [queryURL, setLoading])

  const data = {
    next,
    totalFound,
    reachedLimit,
    errorMessage,
    loading,
    sort,
    searchQuery,
    filter,
    handlePage,
    handleSort,
    handleSearch,
    handleFilter,
    resetState,
    setNext
  }

  return data;
}