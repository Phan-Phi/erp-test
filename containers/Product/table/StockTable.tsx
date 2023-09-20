import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForEdit,
} from "components/TableV3";

import {
  EditButton,
  CheckButton,
  CloseButton,
  NumberFormat,
  WrapperTable,
} from "components";

import { CommonTableProps } from "interfaces";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type StockTableProps = CommonTableProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1> &
  Record<string, any>;

const StockTable = (props: StockTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.warehouseName`} />,
        accessor: "warehouseName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.warehouse.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 1,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.quantityInStock`} />
          </Box>
        ),
        accessor: "quantityInStock",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.quantity") || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
        colSpan: 1,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.low_stock_threshold`} />
          </Box>
        ),
        accessor: "low_stock_threshold",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.low_stock_threshold") || 0;

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={value}
                NumberFormatProps={{
                  allowNegative: false,
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          }
        },
        colSpan: 1,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.costPrice`} />
          </Box>
        ),
        accessor: "costPrice",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = "price";

          const value = get(row, `original.price.excl_tax`) || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          }
        },
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.costPriceInclTax`} />
          </Box>
        ),
        accessor: "costPriceInclTax",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = "price_incl_tax";

          const value = get(row, `original.price.incl_tax`) || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
            writePermission,
            activeEditRow,
            activeEditRowHandler,
            removeEditRowDataHandler,
          } = props;

          if (writePermission) {
            return (
              <Stack flexDirection="row" alignItems="center" columnGap={1}>
                {activeEditRow[row.original.id] ? (
                  <Fragment>
                    <CheckButton
                      disabled={!!updateLoading[row.original.id]}
                      onClick={updateHandler([row])}
                    />

                    <CloseButton
                      disabled={!!updateLoading[row.original.id]}
                      onClick={removeEditRowDataHandler([row])}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <EditButton onClick={activeEditRowHandler(row)} />
                  </Fragment>
                )}
              </Stack>
            );
          }

          return null;
        },
        width: 120,
        maxWidth: 120,
        sticky: "right",
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <WrapperTable>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="flex-end">
          <TablePagination
            count={count}
            page={pagination.pageIndex}
            rowsPerPage={pagination.pageSize}
            onPageChange={(_, page) => {
              onPageChange(page);
            }}
            onRowsPerPageChange={onPageSizeChange}
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default StockTable;
