import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import { CommonTableProps } from "interfaces";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import {
  CheckButton,
  DeleteButton,
  EditButton,
  NumberFormat,
  PrintButton,
  ViewButton,
  WrapperTable,
} from "components";
import { useChoice } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ReturnOrderTableProps = CommonTableProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1> &
  Record<string, any>;

const ReturnOrderTable = (props: ReturnOrderTableProps) => {
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
      // {
      //   accessor: "selection",
      //   Header: (props) => {
      //     const { getToggleAllRowsSelectedProps } = props;
      //     return (
      //       <TableHeaderForSelection
      //         getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
      //       />
      //     );
      //   },
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;
      //     return <TableCellForSelection loading={loading} row={row} />;
      //   },
      //   maxWidth: 64,
      //   width: 64,
      // },
      {
        Header: <FormattedMessage id={`table.returnOrderSid`} />,
        accessor: "returnOrderSid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const { return_order_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(
            return_order_statuses,
            value
          );

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
        maxWidth: 120,
        minWidth: 120,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.surcharge`} />
          </Box>
        ),
        accessor: "surcharge",

        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.surcharge.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
        maxWidth: 120,
        minWidth: 120,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.amount`} />
          </Box>
        ),
        accessor: "amount",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
        maxWidth: 120,
        minWidth: 120,
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            approveHandler,
            deleteHandler,
            writePermission,
            approvePermission,
            printReturnOrderHandler,
            onEditReturnOrderHandler,
          } = props;

          const status = get(row, "original.status");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              {status === "Draft" ? (
                <EditButton
                  onClick={() => {
                    onEditReturnOrderHandler(row);
                  }}
                />
              ) : (
                <ViewButton
                  onClick={() => {
                    onEditReturnOrderHandler(row);
                  }}
                />
              )}

              <PrintButton
                onClick={(e) => {
                  e.stopPropagation();
                  printReturnOrderHandler(row);
                }}
              />

              {get(row, "original.status") === "Draft" && approvePermission && (
                <CheckButton
                  onClick={(e) => {
                    e.stopPropagation();
                    approveHandler({
                      data: [row],
                    });
                  }}
                />
              )}

              {get(row, "original.status") === "Draft" && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 240,
        maxWidth: 240,
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
    useSticky,
    useRowSelect
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

export default ReturnOrderTable;
