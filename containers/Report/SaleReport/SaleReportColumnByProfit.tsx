import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { formatDate } from "libs";
import { NumberFormat, Link } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = ["time", "commodity", "discount", "revenue", "base_amount", "profit"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.time`} />,
      accessor: "time",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onViewDetailHandler } = props;

        const value = get(row, "original.date_start");

        return (
          <WrapperTableCell loading={loading}>
            <Link
              href="/"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();

                onViewDetailHandler?.(row);
              }}
            >
              {formatDate(value, "dd/MM/yyyy")}
            </Link>
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.commodity`} />,
      accessor: "commodity",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.revenue.incl_tax") || "0";

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

        const revenue: string = get(row, "original.revenue.incl_tax") || "0";
        const net_revenue: string = get(row, "original.net_revenue.incl_tax") || "0";

        const value = parseFloat(revenue) - parseFloat(net_revenue);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value.toFixed(2))} />
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

        const value: string = get(row, "original.net_revenue.incl_tax") || "0";

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

        const value: string = get(row, "original.base_amount.incl_tax") || "0";

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

        const net_revenue: string = get(row, "original.net_revenue.incl_tax") || "0";
        const base_amount: string = get(row, "original.base_amount.incl_tax") || "0";

        const value = parseFloat(net_revenue) - parseFloat(base_amount);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value.toFixed(2))} />
          </WrapperTableCell>
        );
      },
    },
  ];
};

export default columns;
