import { useEffect, useState } from "react";
import axios from "axios";
import { TOrderByOption } from "../@types/TOrderByOption";
import { TUsePagination } from "../@types/TUsePagination";
import { TPaginationMetaData } from "../@types/TPaginationMetaData";

export const usePagination = <T1, T2>(order: readonly TOrderByOption<T2>[], limit: number, URL: string, 
  initialSearch: string, initialFilter: string, email: string | undefined, searchRef?: React.RefObject<HTMLInputElement>)
  : TUsePagination<T1, TOrderByOption<T2>> => {
  
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState<TOrderByOption<T2>>(order[0]);
  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<Readonly<T1[]>>([]);
  const [reachedLimit, setReachedLimit] = useState<boolean>(false);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryURL = `${URL}?search=${searchQuery}&filter=${filter}&sort=${sort.orderBy}&page=${page}&limit=${limit}&asc=${sort.order === 'asc'}`;

  const handlePage = () => {
    if (!reachedLimit && !loading) {
      setPage((curPage) => curPage + 1);
    }
  }

  const handleSort = (optionIndex: number) => {
    const option: TOrderByOption<T2> = order[optionIndex];
    setSort(option);
    resetState();
  }

  const handleSearch = () => {
    if (!searchRef || !searchRef.current) {
      return;
    }

    const query: string = searchRef.current.value.trim();
    if (query.length > 0) {
      searchRef.current.value = "";
      setSearchQuery(query);
      resetState();
    }
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
            setErrorMessage("");
            
            if (!response.data.meta.has_next) {
              setReachedLimit(true);
            }
          }
        }
        catch (error: any) {
          setErrorMessage(error.message);
        }
        finally {
          setLoading(false);
        }
      })()
    }, 500);
  }, [queryURL, setLoading, email])

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
    resetState
  }

  return data;
}