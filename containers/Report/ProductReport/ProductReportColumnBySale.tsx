import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";
import { PropsWithChildren } from "react";

import get from "lodash/get";

import { NumberFormat, Link } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = ["sku", "productName", "quantity", "revenue", "net_revenue"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sku`} />,
      accessor: "sku",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onViewDetailHandler } = props;

        const value = get(row, "original.sku") || "-";

        return (
          <WrapperTableCell loading={loading}>
            <Link
              href="#"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();

                onViewDetailHandler?.(row);
              }}
            >
              {value}
            </Link>
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.productName`} />,
      accessor: "productName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name") || "-";
        const unit = get(row, "original.unit") || "";

        return (
          <WrapperTableCell title={`${value} - ${unit}`} loading={loading}>
            {value} - {unit}
          </WrapperTableCell>
        );
      },
      maxWidth: 500,
    },
    {
      Header: <FormattedMessage id={`table.quantity`} />,
      accessor: "quantity",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.quantity") || 0;

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
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
  ];
};

export default columns;
