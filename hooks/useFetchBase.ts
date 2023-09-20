import { useCallback, useEffect, useRef, useState } from "react";

import useSWR, { SWRConfiguration } from "swr";

import { ResponseErrorType } from "interfaces/UseFetch";

const useFetchBase = <T = any, V = any, Error = ResponseErrorType>(
  key?: string,
  options?: SWRConfiguration
) => {
  const [data, setData] = useState<T[]>();
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(key);
  const prevPage = useRef(key);

  const {
    isValidating,
    data: resData,
    error,
    mutate,
  } = useSWR<V, Error>(nextPage, options);

  const ref = useRef<{
    mutate: typeof mutate;
    nextPage: string | null;
    previousPage: string | null;
  }>({
    mutate,
    nextPage: null,
    previousPage: null,
  });

  useEffect(() => {
    ref.current.mutate = mutate;
  }, [mutate]);

  const changeKey = useCallback((newKey: string) => {
    if (prevPage.current === newKey) return;

    setData(undefined);
    setIsLoading(true);
    setIsDone(false);

    prevPage.current = newKey;
    setNextPage(newKey);
  }, []);

  const fetchNextPage = useCallback(() => {
    const nextPage = ref.current.nextPage;

    if (!nextPage) return;
    setNextPage(nextPage);
    setIsLoading(true);
  }, []);

  const fetchPreviousPage = useCallback(() => {
    const previousPage = ref.current.previousPage;

    if (!previousPage) return;
    setNextPage(previousPage);
    setIsLoading(true);
  }, []);

  const refreshData = useCallback(() => {
    ref.current.mutate();
    setIsLoading(true);
    setIsDone(false);
  }, []);

  return {
    isLoading,
    setIsLoading,
    isDone,
    setIsDone,
    data,
    setData,
    resData,
    fetchRef: ref,
    error,
    isValidating,
    changeKey,
    fetchNextPage,
    fetchPreviousPage,
    refreshData,
  };
};

export default useFetchBase;
