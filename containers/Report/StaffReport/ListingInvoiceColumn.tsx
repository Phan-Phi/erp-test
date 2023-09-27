import React, { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { NumberFormat } from "components";

import { formatDate } from "libs";
import { WrapperTableCell } from "components/TableV3";

export const keys = ["invoice", "time", "customer", "revenue"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.invoice`} />,
      accessor: "invoice",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.sid") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.time`} />,
      accessor: "time",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.date_created");

        return <WrapperTableCell loading={loading}>{formatDate(value)}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.customer`} />,
      accessor: "customer",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.order.receiver_name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.net_revenue`} />,
      accessor: "net_revenue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
  ];
};

export default columns;
