import { ResponseType, ResponseErrorType } from "interfaces";
import { useCallback, useEffect, useRef, useState } from "react";

import useSWRInfinite, {
  SWRInfiniteKeyLoader,
  SWRInfiniteConfiguration,
} from "swr/infinite";

const useFetchInfinite = <
  T = any,
  V extends ResponseType<T> = ResponseType<T>,
  Error = ResponseErrorType,
  KeyLoader extends SWRInfiniteKeyLoader = SWRInfiniteKeyLoader,
>(
  getKey: KeyLoader,
  options?: SWRInfiniteConfiguration
) => {
  const [data, setData] = useState<T[]>();
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastItemRef = useRef<unknown>();

  const {
    isValidating,
    data: resData,
    error,
    mutate,
    size,
    setSize,
  } = useSWRInfinite<V, Error>(getKey, options);

  useEffect(() => {
    if (resData == undefined && isValidating) setIsLoading(true);

    if (isValidating) return;

    if (resData == undefined) return;

    const mergeData = resData.map((el) => el.results).flat(1);

    const lastItem = resData[resData.length - 1];

    lastItemRef.current = lastItem;

    const { next } = lastItem;

    if (next == null) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }

    setData(mergeData);
    setIsLoading(false);
  }, [resData, isValidating]);

  const fetchNextPage = useCallback(() => {
    setSize((prev) => {
      return prev + 1;
    });

    setIsLoading(true);
  }, []);

  const refreshData = useCallback(() => {
    mutate();
    setIsLoading(true);
  }, []);

  return {
    data,
    error,
    rawData: resData,
    size,

    isDone,
    isLoading,
    isValidating,

    fetchNextPage,
    refreshData,
    lastItem: lastItemRef.current as V | undefined,
  };
};
export default useFetchInfinite;
