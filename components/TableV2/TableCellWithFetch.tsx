import useSWR from "swr";
import React, { Fragment } from "react";

import { Skeleton } from "@mui/material";

type Props<T> = {
  url: string;
  loading?: boolean;
  children: (data: T) => React.ReactElement;
};

const TableCellWithFetch = <T extends Record<string, unknown>>(props: Props<T>) => {
  const { url, loading, children } = props;

  const { data, error } = useSWR<T>(
    () => {
      if (!loading) {
        return url;
      }
    },
    {
      errorRetryCount: 1,
    }
  );

  if (error) {
    return <Fragment>-</Fragment>;
  }

  if (data == undefined || loading) {
    return <Skeleton />;
  }

  return children(data);
};

export default TableCellWithFetch;
