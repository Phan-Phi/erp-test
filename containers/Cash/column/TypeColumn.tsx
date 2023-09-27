import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";
import { Skeleton, Stack } from "@mui/material";

import { CASHES, EDIT, TYPE } from "routes";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = [
  "selection",
  "transactionType",
  "beginning_balance",
  "total_revenue",
  "total_expense",
  "total_balance",
  "action",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
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
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        return <TableCellForSelection loading={loading} row={row} />;
      },
      maxWidth: 64,
      width: 64,
    },
    {
      Header: <FormattedMessage id={`table.transactionType`} />,
      accessor: "transactionType",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },

    {
      Header: <FormattedMessage id={`table.beginning_balance`} />,
      accessor: "beginning_balance",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.beginning_balance.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="right">
            <NumberFormat value={parseFloat(value)} suffix=" ₫" />
          </WrapperTableCell>
        );
      },
    },

    {
      Header: <FormattedMessage id={`table.total_revenue`} />,
      accessor: "total_revenue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.total_revenue.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="right">
            <NumberFormat value={parseFloat(value)} suffix=" ₫" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.total_expense`} />,
      accessor: "total_expense",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.total_expense.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="right">
            <NumberFormat value={parseFloat(value)} suffix=" ₫" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.total_balance`} />,
      accessor: "total_balance",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.total_balance.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="right">
            <NumberFormat value={parseFloat(value)} suffix=" ₫" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row, writePermission, deleteHandler } = props;

        const status = get(row, "original.status");
        const isUsed = get(row, "original.is_used");

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" alignItems="center" columnGap={1}>
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
};

export default columns;
