import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

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
import { CASHES, EDIT, TYPE } from "routes";
import { CommonTableProps } from "interfaces";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import { ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type TypeColumnV2TableProps = CommonTableProps<ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1> &
  Record<string, any>;

export default function TypeColumnV2(props: TypeColumnV2TableProps) {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    renderHeaderContentForSelectedRow,
    writePermission,
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
        Header: <FormattedMessage id={`table.transactionType`} />,
        accessor: "transactionType",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.beginning_balance`} />,
        accessor: "beginning_balance",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.beginning_balance.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right" minWidth={90}>
              <NumberFormat value={parseFloat(value)} suffix=" ₫" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.total_revenue`} />,
        accessor: "total_revenue",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.total_revenue.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right" minWidth={70}>
              <NumberFormat value={parseFloat(value)} suffix=" ₫" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.total_expense`} />,
        accessor: "total_expense",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.total_expense.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right" minWidth={80}>
              <NumberFormat value={parseFloat(value)} suffix=" ₫" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.total_balance`} />,
        accessor: "total_balance",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.total_balance.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right" minWidth={90}>
              <NumberFormat value={parseFloat(value)} suffix=" ₫" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const status = get(row, "original.status");
          const isUsed = get(row, "original.is_used");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} minWidth={70}>
              <ViewButton href={`/${CASHES}/${TYPE}/${EDIT}/${row.original.id}`} />

              {writePermission && !isUsed && status === "Draft" && (
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
    <Box>
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
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
