import useSWR from "swr";
import { set } from "lodash";
import queryString from "query-string";
import { useUpdateEffect } from "react-use";
import { useState, useCallback } from "react";

import { useToggle } from "./useToggle";
import { responseSchema } from "interfaces";

const PAGE_SIZE = 1000;

export const useFetchAllData = <T extends Record<string, unknown>>() => {
  const { onClose: stopToFetch, onOpen: startToFetch, open: shouldFetch } = useToggle();

  const [isDone, setIsDone] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>();

  const { data: resData } = useSWR<responseSchema<T>>(() => {
    if (!shouldFetch) return;

    return nextUrl;
  });

  useUpdateEffect(() => {
    if (resData == undefined) return;

    if (resData.next == null) {
      setIsDone(true);
      setNextUrl(resData.next);
    } else {
      const { pathname, search } = new URL(resData.next);

      setNextUrl(`${pathname}${search}`);
    }

    setData((prev) => {
      return prev.concat(resData.results);
    });
  }, [resData]);

  const setUrl = useCallback((url: string | null) => {
    setData([]);
    setIsDone(false);

    if (url) {
      try {
        const { pathname } = new URL(url);

        const { query } = queryString.parseUrl(url);

        set(query, "page_size", PAGE_SIZE);

        setNextUrl(`${pathname}?${queryString.stringify(query)}`);
      } catch (err) {
        const { query, url: pathname } = queryString.parseUrl(url);

        set(query, "page_size", PAGE_SIZE);

        setNextUrl(`${pathname}?${queryString.stringify(query)}`);
      }
      startToFetch();
    } else {
      setNextUrl(url);
      stopToFetch();
    }
  }, []);

  return {
    isDone,
    data,
    setUrl,
  };
};
