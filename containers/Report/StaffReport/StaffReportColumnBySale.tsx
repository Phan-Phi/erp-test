import React, { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { NumberFormat, Link } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = ["seller", "revenue", "returnValue", "net_revenue"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.seller`} />,
      accessor: "seller",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onViewDetailHandler } = props;

        const value = get(row, "original.name") || "-";

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
    // {
    //   Header: <FormattedMessage id={`table.returnValue`} />,
    //   accessor: "returnValue",
    //   textAlign: "right",
    //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
    //     const { row } = props;

    //     const revenue = get(row, "original.revenue.incl_tax") || "0";

    //     const netRevenue = get(row, "original.net_revenue.incl_tax") || "0";

    //     const value = parseFloat(revenue) - parseFloat(netRevenue);

    //     return (
    //       <WrapperTableCell loading={loading} textAlign="center">
    //         <NumberFormat value={parseFloat(value.toFixed(2))} />
    //       </WrapperTableCell>
    //     );
    //   },
    // },
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
