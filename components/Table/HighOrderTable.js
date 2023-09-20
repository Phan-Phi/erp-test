import useSWR from "swr";
import { useIntl } from "react-intl";
import { Typography, Stack } from "@mui/material";
import { usePrevious, useUpdateEffect } from "react-use";
import { useCallback, useMemo, useState, useEffect, Fragment } from "react";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";

import { createInitDataTable } from "../../libs/utils";
import { LoadingDynamic as Loading, LoadingButton, Table } from "../../components";

import DynamicMessage from "../../messages";

const HighOrderTable = ({
  url = null,
  keys = [],
  columnFn = () => {},
  passHandler = () => {},
  deleteLoading = {},
  deleteHandler = () => {},
  mutationObj = null,
  setMutationObj = {},
  TableProps = {},
  TablePaginationProps = {},
  TableContainerProps = {},
  TableTitleProps = {},
  TableBodyProps = {},
  TableHeadProps = {},
  writePermission = false,
  useDefaultHeaderContent = true,
  children = null,
  titleComponent,
  ...props
}) => {
  const { formatMessage, messages } = useIntl();
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState(createInitDataTable(keys, 2));
  const prevData = usePrevious(data);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);

  const {
    data: resData,
    error,
    mutate,
  } = useSWR(() => {
    return url;
  });

  const prevError = usePrevious(error);

  useUpdateEffect(() => {
    if (error == undefined || isEqual(error, prevError)) {
      return;
    }

    const message = get(error, "response.data.message");

    if (message && message.includes("Invalid page")) {
      setPage(page - 1);
    }
  }, [error, prevError, page]);

  useEffect(() => {
    passHandler({
      page,
      pageSize,
      mutate,
    });
  }, [page, pageSize, mutate]);

  const columns = useMemo(() => {
    return columnFn(loading);
  }, [loading]);

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setLoading(true);
    setPage(pageIndex + 1);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    if (!isEmpty(resData)) {
      let data = get(resData, "results");
      let count = get(resData, "count");
      setData(data);
      setPageCount(Math.ceil(get(resData, "count") / pageSize));
      setTotalCount(count);
      setLoading(false);
    }
  }, [data, resData, pageSize]);

  useEffect(() => {
    if (resData == undefined) {
      return;
    }

    if (isEqual(prevData, data) && loading) {
      if (typeof get(data, "[0]") === "object" || data?.length === 0) {
        setLoading(false);
      }
    }
  }, [resData, pageSize, loading, prevData, data]);

  if (error) {
    return null;
  }

  if (data == undefined) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Table
        {...{
          passHandler,
          columns,
          data,
          fetchData,
          loading,
          pageCount,
          totalCount,
          TableHeadProps: {
            ...(useDefaultHeaderContent && {
              children: (selectedFlatRows) => {
                return (
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Typography>
                      {formatMessage(DynamicMessage.selectedRow, {
                        length: selectedFlatRows.length,
                      })}
                    </Typography>

                    {writePermission && (
                      <LoadingButton
                        {...{
                          type: "delete",
                          loading: !!deleteLoading["all"],
                          disabled: !!deleteLoading["all"],
                          color: "error",
                          onClick: (e) => {
                            e.stopPropagation();

                            deleteHandler({ data: selectedFlatRows });
                          },
                        }}
                      >
                        {deleteLoading["all"]
                          ? messages["deletingStatus"]
                          : messages["deleteStatus"]}
                      </LoadingButton>
                    )}
                  </Stack>
                );
              },
            }),
            ...TableHeadProps,
          },
          TableBodyProps,
          TableProps,
          TableContainerProps,
          TablePaginationProps,
          TableTitleProps,
          deleteLoading,
          deleteHandler,
          setMutationObj,
          writePermission,
          titleComponent,
          initPageSize: pageSize,
          initPageIndex: page - 1,
          ...props,
        }}
      />

      {children}
    </Fragment>
  );
};

export default HighOrderTable;
