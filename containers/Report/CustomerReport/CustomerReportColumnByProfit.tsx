import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";
import { PropsWithChildren } from "react";

import get from "lodash/get";

import { NumberFormat } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = [
  "customer",
  "revenue",
  "discount",
  "net_revenue",
  "base_amount",
  "profit",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.customer`} />,
      accessor: "customer",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },

    {
      Header: <FormattedMessage id={`table.revenue`} />,
      accessor: "revenue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.revenue.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.discount`} />,
      accessor: "discount",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const revenue = get(row, "original.revenue.incl_tax") || "0";
        const netRevenue = get(row, "original.net_revenue.incl_tax") || "0";

        const value = (parseFloat(revenue) - parseFloat(netRevenue)).toFixed(2);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.net_revenue`} />,
      accessor: "net_revenue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.net_revenue.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.base_amount`} />,
      accessor: "base_amount",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.base_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.profit`} />,
      accessor: "profit",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const netRevenue = get(row, "original.net_revenue.incl_tax") || "0";
        const baseAmount = get(row, "original.base_amount.incl_tax") || "0";

        const value = (parseFloat(netRevenue) - parseFloat(baseAmount)).toFixed(2);

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
