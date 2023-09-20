import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrevious } from "react-use";
import useSWR from "swr";
import { useRouter } from "next/router";

import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import get from "lodash/get";

import { createInitDataTable } from "../libs/utils";

const useFetchTableData = ({ keys, url, columnFunc }) => {
  const router = useRouter();

  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState(createInitDataTable(keys, 2));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const prevData = usePrevious(data);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    data: resData,
    error,
    mutate,
  } = useSWR(() => {
    return url;
  });

  const columns = useMemo(() => {
    return columnFunc(loading);
  }, [loading]);

  useEffect(() => {
    const statusCode = get(resData, "statusCode");

    if (statusCode === 404) {
      setPage((prev) => {
        return prev - 1;
      });
      return;
    }

    if (statusCode === 403) {
      router.replace("/");
      return;
    }

    if (!isEmpty(resData)) {
      let data = get(resData, "data.results");
      let count = get(resData, "data.count");
      setData(data);
      setPageCount(Math.ceil(get(resData, "data.count") / 10));
      setTotalCount(count);
      setLoading(false);
    }
  }, [data, get(resData, "data.results")]);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setLoading(true);
    setPage(pageIndex + 1);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    if (resData === undefined) {
      return;
    }

    if (isEqual(prevData, data) && loading) {
      if (typeof get(data, [0]) === "object" || data.length === 0) {
        setLoading(false);
      }
    }
  }, [resData, pageSize, loading, prevData, data]);

  return {
    columns,
    pageCount,
    data,
    totalCount,
    fetchData,
    loading,
    page,
    pageSize,
    error,
    mutate,
  };
};

export default useFetchTableData;
