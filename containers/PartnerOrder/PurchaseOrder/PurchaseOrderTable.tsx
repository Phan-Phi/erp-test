import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";

import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

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
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";
import { DeleteButton, Link, NumberFormat, ViewButton, WrapperTable } from "components";

import { useChoice } from "hooks";
import { CommonTableProps } from "interfaces";
import { EDIT, PURCHASE_ORDERS } from "routes";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type PurchaseOrderTableProps =
  CommonTableProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1> & Record<string, any>;

const PurchaseOrderTable = (props: PurchaseOrderTableProps) => {
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
        accessor: "selection",
        Header: (props) => {
          const { getToggleAllRowsSelectedProps } = props;

          return (
            <TableHeaderForSelection
              getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
            />
          );
        },
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },
      {
        Header: <FormattedMessage id={`table.purchaseOrderSid`} />,
        accessor: "purchaseOrderSid",
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
        Header: <FormattedMessage id={`table.date_placed`} />,
        accessor: "date_placed",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.date_placed");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
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
          const { purchase_order_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(
            purchase_order_statuses,
            value
          );

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.partnerName`} />,
        accessor: "partner.name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.partner.name");
          const id = get(row, "original.partner.id");

          return (
            <WrapperTableCell title={value}>
              {id ? (
                <Link
                  href={"#"}
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onGotoHandler?.(row);
                  }}
                >
                  {value}
                </Link>
              ) : (
                "-"
              )}
            </WrapperTableCell>
          );
        },
        maxWidth: 300,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.total_price`} />
          </Box>
        ),
        accessor: "total_price",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.total_price.incl_tax");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.warehouseName`} />,
        accessor: "warehouseName",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.warehouse_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, deleteHandler } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${PURCHASE_ORDERS}/${EDIT}/${row.original.id}`} />

              {writePermission && get(row, "original.status") === "Draft" && (
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

export default PurchaseOrderTable;
