import useSWR, { SWRConfiguration } from "swr";
import { useCallback, useEffect, useRef, useState } from "react";

import { ResponseErrorType, ResponseType } from "interfaces";

type PageType = string | null | undefined;

const useFetch = <
  T = any,
  V extends ResponseType<T> = ResponseType<T>,
  Error = ResponseErrorType
>(
  key?: string,
  options?: SWRConfiguration
) => {
  const [data, setData] = useState<T[]>();
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef<{
    previousPage?: PageType;
    currentPage?: PageType;
    nextPage?: PageType;
  }>({
    previousPage: null,
    currentPage: null,
    nextPage: null,
  });

  const [nextPage, setNextPage] = useState<PageType>(key);

  const {
    isValidating,
    data: resData,
    error,
    mutate,
  } = useSWR<V, Error>(nextPage, options);

  const previousRawData = useRef<V | undefined>(resData);

  useEffect(() => {
    if (resData == undefined && isValidating) setIsLoading(true);

    if (isValidating) return;

    if (resData == undefined) return;

    previousRawData.current = resData;

    const { results, previous, next } = resData;

    let nextPage = next;
    let previousPage = previous;

    if (nextPage) {
      const { pathname, search } = new URL(nextPage);
      nextPage = `${pathname}${search}`;
    }

    if (previousPage) {
      const { pathname, search } = new URL(previousPage);
      previousPage = `${pathname}${search}`;
    }

    pageRef.current = {
      previousPage: previousPage,
      currentPage: null,
      nextPage: nextPage,
    };

    if (nextPage == null) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }

    setData(results);
    setIsLoading(false);
  }, [resData, isValidating]);

  const changeKey = useCallback((newKey: string) => {
    setNextPage(newKey);
    setData(undefined);
    setIsLoading(true);
    setIsDone(false);
  }, []);

  const fetchNextPage = useCallback(() => {
    const nextPage = pageRef.current.nextPage;

    if (nextPage) {
      setNextPage(nextPage);
      setIsLoading(true);
    }
  }, []);

  const fetchPreviousPage = useCallback(() => {
    const previousPage = pageRef.current.previousPage;

    if (previousPage) {
      setNextPage(previousPage);
      setIsLoading(true);
    }
  }, []);

  const refreshData = useCallback(() => {
    mutate();
    setIsLoading(true);
  }, []);

  return {
    data,
    rawData: resData,
    previousRawData: previousRawData.current,
    error,
    isDone,
    isLoading,
    isValidating,
    changeKey,
    pageState: pageRef.current,
    fetchNextPage,
    fetchPreviousPage,
    refreshData,
  };
};
export default useFetch;
