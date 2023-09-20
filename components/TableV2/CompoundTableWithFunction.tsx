import { useUpdateEffect } from "react-use";
import { useSticky } from "react-table-sticky";

import {
  Row,
  Column,
  useSortBy,
  TableInstance,
  useRowSelect,
  usePagination,
  ColumnInstance,
  useExpanded,
} from "react-table";

import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { Stack } from "@mui/material";

import CompoundTable, { type CompoundTableProps } from "components/TableV2/CompoundTable";

import { useTable, ExtendTableOptions, useFetchV2 } from "hooks";

import TablePagiantion from "components/TableV2/TablePagiantion";

import { LoadingDynamic as Loading } from "components";

import { transformUrl } from "libs";

type CompoundTablePropsWithoutPrepareRow<T extends Record<string, unknown>> = Omit<
  CompoundTableProps<T>,
  "prepareRow" | "tableInstance"
>;

export interface ExtendableTableInstanceProps<T extends Record<string, unknown> = {}>
  extends TableInstance<T> {
  mutate: () => void;
  setUrl: (newKey: string) => void;
}

interface CompoundTableWithFunctionProps<T extends Record<string, unknown>>
  extends CompoundTablePropsWithoutPrepareRow<T> {
  url?: string;
  columnFn: (loading?: boolean) => Column<T>[];
  passHandler?: (tableInstance: ExtendableTableInstanceProps<T>) => void;
  [key: string]: any;
}

export interface PropsForAction<T extends Record<string, unknown> = {}> {
  row: Row<T>;
  column: ColumnInstance<T>;
}

export default function CompoundTableWithFunction<T extends Record<string, unknown>>(
  props: CompoundTableWithFunctionProps<T>
) {
  const {
    columnFn,
    url: initUrl,
    passHandler: externalPassHandler,
    ...restProps
  } = props;
  const tableState = useRef<TableInstance<T>>();
  const pageRef = useRef<number>(1);
  const pageSizeRef = useRef<number>(25);

  const {
    data,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    previousRawData,
    changeKey,
    refreshData,
  } = useFetchV2<T>(
    initUrl
      ? transformUrl(initUrl, {
          page_size: pageSizeRef.current,
        })
      : undefined
  );

  const columns = useMemo(() => columnFn(isLoading), [isLoading]);

  const fetchData = useCallback(
    ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      const currentPage = pageRef.current;

      if (pageIndex + 1 > currentPage) {
        fetchNextPage();
      } else if (pageIndex + 1 < currentPage) {
        fetchPreviousPage();
      }

      pageRef.current = pageIndex + 1;

      if (pageSize !== pageSizeRef.current) {
        changeKey(
          transformUrl(initUrl, {
            page_size: pageSize,
          })
        );
      }

      pageSizeRef.current = pageSize;
    },
    [initUrl]
  );

  const setUrl = useCallback((newKey: string) => {
    pageRef.current = 1;
    changeKey(newKey);
  }, []);

  useUpdateEffect(() => {
    if (externalPassHandler && tableState.current) {
      externalPassHandler({
        ...tableState.current,
        mutate: refreshData,
        setUrl,
      });
    }
  }, []);

  const passHandler = useCallback((tableInstance: TableInstance<T>) => {
    tableState.current = tableInstance;

    if (externalPassHandler) {
      externalPassHandler({
        ...tableInstance,
        mutate: refreshData,
        setUrl,
      });
    }
  }, []);

  if (data == undefined || previousRawData == undefined) {
    return (
      <Stack alignItems="center">
        <Loading />
      </Stack>
    );
  }

  return (
    <CustomTable<T>
      data={data}
      columns={columns}
      totalCount={(previousRawData && previousRawData.count) || 0}
      passHandler={passHandler}
      initialState={{
        pageSize: pageSizeRef.current,
        pageIndex: pageRef.current - 1,
      }}
      pageCount={
        previousRawData && Math.ceil(previousRawData.count / pageSizeRef.current)
      }
      fetchData={fetchData}
      {...restProps}
    />
  );
}

interface ExtendFunctionTableOptions<T extends Record<string, unknown>>
  extends ExtendTableOptions<T>,
    CompoundTablePropsWithoutPrepareRow<T> {
  passHandler?: (tableInstance: TableInstance<T>) => void;
  totalCount: number;
  fetchData: ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => void;
}

function CustomTable<T extends Record<string, unknown>>(
  props: ExtendFunctionTableOptions<T>
) {
  const {
    data,
    columns,
    fetchData,
    totalCount,
    TableProps,
    passHandler,
    initialState,
    bodyItemList,
    TableRowProps,
    TableCellProps,
    headerItemList,
    TableBodyProps,
    TableHeadProps,
    renderBodyItem,
    renderPagination,
    renderHeaderItem,
    TableContainerProps,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const instance = useTable<T>({
    columns,
    data,
    hooks: [useSortBy, useExpanded, usePagination, useRowSelect, useSticky],
    initialState,
    ...restProps,
  });

  useEffect(() => {
    passHandler?.(instance);
  }, [instance.state, instance.activeEditRow]);

  useUpdateEffect(() => {
    fetchData({ pageIndex: instance.state.pageIndex, pageSize: instance.state.pageSize });
  }, [fetchData, instance.state.pageSize, instance.state.pageIndex]);

  const onChangePageHandler = useCallback((_, newPage) => {
    instance.gotoPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      instance.setPageSize(parseInt(e.target.value));
      instance.gotoPage(0);
    },
    []
  );

  const renderpaginationCallback = useCallback(() => {
    return (
      <TablePagiantion
        count={totalCount ?? 0}
        page={instance.state.pageIndex}
        onPageChange={onChangePageHandler}
        rowsPerPage={instance.state.pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  }, [instance.state, totalCount, renderPagination]);

  const { headerGroups, prepareRow, page } = instance;
  return (
    <CompoundTable
      headerItemList={headerGroups}
      prepareRow={prepareRow}
      bodyItemList={page}
      renderPagination={renderpaginationCallback}
      TableBodyProps={TableBodyProps}
      TableCellProps={TableCellProps}
      TableContainerProps={TableContainerProps}
      TableHeadProps={TableHeadProps}
      TableProps={TableProps}
      TableRowProps={TableRowProps}
      renderBodyItem={renderBodyItem}
      renderHeaderItem={renderHeaderItem}
      tableInstance={instance}
      renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
    />
  );
}
