import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import { useChoice } from "hooks";
import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";

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
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ReceiptOrderTableProps =
  CommonTableProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1> & Record<string, any>;

const ReceiptOrderTable = (props: ReceiptOrderTableProps) => {
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
        Header: <FormattedMessage id={`table.receiptOrderSid`} />,
        accessor: "receiptOrderSid",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
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
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value, "dd-MM-yyyy")}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const { receipt_order_statuses } = useChoice();
          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(
            receipt_order_statuses,
            value
          );

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.surcharge`} />
          </Box>
        ),
        accessor: "surcharge",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.surcharge.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.amount`} />
          </Box>
        ),
        accessor: "amount",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            loading: approveLoading,
            approveHandler,
            deleteHandler,
            writePermission,
            approvePermission,
            printReceiptOrderHandler,
            onEditReceiptOrderHandler,
          } = props;

          const id = get(row, "original.id");
          const status = get(row, "original.status");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              {status === "Draft" ? (
                <EditButton
                  onClick={() => {
                    onEditReceiptOrderHandler(row);
                  }}
                />
              ) : (
                <ViewButton
                  onClick={() => {
                    onEditReceiptOrderHandler(row);
                  }}
                />
              )}

              <PrintButton
                onClick={(e) => {
                  e.stopPropagation();
                  printReceiptOrderHandler(row);
                }}
              />

              {status === "Draft" && approvePermission && (
                <CheckButton
                  disabled={!!approveLoading[id]}
                  onClick={(e) => {
                    e.stopPropagation();
                    approveHandler({
                      data: [row],
                    });
                  }}
                />
              )}

              {status === "Draft" && writePermission && (
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
        width: 180,
        maxWidth: 180,
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

export default ReceiptOrderTable;
