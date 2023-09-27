import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { formatDate } from "libs";
import { NumberFormat } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = [
  "sid",
  "time",
  "commodity",
  "discount",
  "revenue",
  "base_amount",
  "profit",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sid`} />,
      accessor: "sid",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.sid");

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
      Header: <FormattedMessage id={`table.commodity`} />,
      accessor: "commodity",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string =
          get(row, "original.amount_before_discounts.incl_tax") || "0";

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

        const amountBeforeDiscount =
          get(row, "original.amount_before_discounts.incl_tax") || "0";

        const amount = get(row, "original.amount.incl_tax") || "0";

        const value = parseFloat(amountBeforeDiscount) - parseFloat(amount);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} />
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

        const value: string = get(row, "original.amount.incl_tax") || "0";

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

        const amount = get(row, "original.amount.incl_tax") || "0";

        const baseAmount = get(row, "original.base_amount.incl_tax") || "0";

        const value = parseFloat(amount) - parseFloat(baseAmount);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} />
          </WrapperTableCell>
        );
      },
    },
  ];
};

export default columns;
