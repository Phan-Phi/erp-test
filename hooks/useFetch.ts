import { SWRConfiguration } from "swr";
import { useEffect, useState } from "react";

import useFetchBase from "./useFetchBase";
import { ResponseErrorType, ResponseType } from "interfaces/UseFetch";

const useFetch = <
  T = any,
  V extends ResponseType<T> = ResponseType<T>,
  Error = ResponseErrorType,
>(
  key?: string,
  options?: SWRConfiguration
) => {
  const {
    resData,
    data,
    setData,
    isValidating,
    setIsLoading,
    setIsDone,
    changeKey,
    isDone,
    isLoading,
    error,
    refreshData,
    fetchRef,
    fetchNextPage,
    fetchPreviousPage,
  } = useFetchBase<T, V, Error>(key, options);

  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (key == undefined) return;
    if (resData == undefined && isValidating) setIsLoading(true);
    if (isValidating) return;
    if (resData == undefined) return;

    const { next, previous, results, count } = resData;

    setData(results);

    fetchRef.current.nextPage = next;
    fetchRef.current.previousPage = previous;

    if (next) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }

    count?.toString() && setItemCount(count);

    setIsLoading(false);
  }, [resData, isValidating, key]);

  return {
    data,
    resData,
    error,
    isDone,
    isLoading,
    isValidating,
    changeKey,
    refreshData,
    fetchNextPage,
    fetchPreviousPage,
    itemCount,
  };
};
export default useFetch;
