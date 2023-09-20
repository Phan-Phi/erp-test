import { useCallback, useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import { Grid, Box, Table as MuiTable, Stack } from "@mui/material";

import { useIntl } from "react-intl";

import TableContainer from "./TableContainer";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import TableTitle from "./TableTitle";
import ColumnFilter from "./ColumnFilter";

import { InputSearchFilter } from "../../components";

const Table = ({
  TableProps = {},
  TableContainerProps = {},
  TableHeadProps = {},
  TableTitleProps = {},
  TableBodyProps = {},
  TablePaginationProps = {},
  shouldPagination = true,
  columns,
  data,
  fetchData,
  pageCount,
  totalCount,
  loading,
  passHandler = () => {},
  titleComponent,
  hiddenColumns = [],
  tableBodyComponent,
  columnFilterComponent,
  useSearch = false,
  initPageSize = 25,
  initPageIndex = 0,
  ...props
}) => {
  const {
    getToggleHideAllColumnsProps,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    allColumns,
    selectedFlatRows,
    rows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns,
        pageSize: initPageSize,
        pageIndex: initPageIndex,
      },
      manualPagination: true,
      pageCount,
      autoResetPage: false,
      ...props,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const { messages } = useIntl();

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  useEffect(() => {
    passHandler({
      selectedFlatRows,
      gotoPage,
    });
  }, [selectedFlatRows]);

  const handleChangePage = useCallback((_, newPage) => {
    gotoPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    setPageSize(e.target.value);
    gotoPage(0);
  }, []);

  const children = useMemo(() => {
    return (
      <MuiTable size="small" {...getTableProps()} stickyHeader {...TableProps}>
        <TableHead
          {...{
            headerGroups,
            allColumns,
            selectedFlatRows,
            ...TableHeadProps,
          }}
        />
        {typeof tableBodyComponent === "function" ? (
          tableBodyComponent()
        ) : (
          <TableBody
            {...{
              allColumns,
              getTableBodyProps,
              loading,
              page,
              prepareRow,
              ...TableBodyProps,
              ...(shouldPagination
                ? {
                    page,
                  }
                : {
                    rows,
                  }),
            }}
          />
        )}
      </MuiTable>
    );
  });

  return (
    <Grid container spacing={2} direction="row">
      <Grid item xs={12}>
        {typeof titleComponent === "function" ? (
          titleComponent(TableTitleProps)
        ) : (
          <TableTitle {...TableTitleProps} />
        )}
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" justifyContent={"space-between"} alignItems="center">
          {useSearch ? (
            <InputSearchFilter
              {...{
                label: messages["search"],
                passHandler,
                gotoPage,
              }}
            />
          ) : (
            <div></div>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <TablePagination
              {...{
                handleChangePage,
                handleChangeRowsPerPage,
                pageIndex,
                pageSize,
                totalCount,
              }}
            />
            {typeof columnFilterComponent === "function" ? (
              columnFilterComponent({ allColumns, getToggleHideAllColumnsProps })
            ) : (
              <ColumnFilter
                {...{
                  allColumns,
                  getToggleHideAllColumnsProps,
                }}
              />
            )}
          </Box>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          padding: "2px",
        }}
      >
        <TableContainer {...TableContainerProps}>{children}</TableContainer>
      </Grid>
    </Grid>
  );
};

export default Table;
