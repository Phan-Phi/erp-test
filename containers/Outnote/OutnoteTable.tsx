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
import { DeleteButton, NumberFormat, ViewButton, WrapperTable } from "components";

import { useChoice } from "hooks";
import { EDIT, OUTNOTES } from "routes";
import { PARTNER_ITEM, CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type OutnoteTableProps = CommonTableProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1> &
  Record<string, any>;

const OutnoteTable = (props: OutnoteTableProps) => {
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
        Cell: (props: PropsWithChildren<CellProps<PARTNER_ITEM, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },
      {
        Header: <FormattedMessage id={`table.outnoteSid`} />,
        accessor: "outnoteSid",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
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
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
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
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;
          const { stock_out_note_statuses } = useChoice();
          const value: string = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(
            stock_out_note_statuses,
            value
          );

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.total_price`} />
          </Box>
        ),
        accessor: "total_price",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.total_price.incl_tax") || "0";

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
            <FormattedMessage id={`table.shipping_charge`} />
          </Box>
        ),
        accessor: "shipping_charge",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.shipping_charge.incl_tax") || "0";

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
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
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
          const { row, deleteHandler, writePermission } = props;

          const status = get(row, "original.status");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${OUTNOTES}/${EDIT}/${row.original.id}`} />

              {writePermission && status === "Draft" && (
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

export default OutnoteTable;
