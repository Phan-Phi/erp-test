import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { formatDate, transformUrl } from "libs";
import { Link, NumberFormat } from "components";
import { TableCellWithFetch, WrapperTableCell } from "components/TableV3";
import { WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER } from "apis";

export const keys = [
  "sid",
  "date_created",
  "quantity",
  "returnValue",
  "importStockValue",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sid`} />,
      accessor: "sid",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.sid");

        return (
          <WrapperTableCell loading={loading}>
            <Link
              href="#"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();

                row?.toggleRowExpanded();
              }}
            >
              {value}
            </Link>
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.date_created`} />,
      accessor: "date_created",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.date_created");

        return <WrapperTableCell loading={loading}>{formatDate(value)}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.importStock`} />,
      accessor: "importStock",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.item_count");

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.importStockValue`} />,
      accessor: "importStockValue",
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
      Header: <FormattedMessage id={`table.returnValue`} />,
      accessor: "returnValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, filter } = props;

        const id = get(row, "original.id");

        return (
          <TableCellWithFetch
            url={transformUrl(WAREHOUSE_PURCHASE_ORDER_RECEIPT_ORDER_RETURN_ORDER, {
              order: id,
              date_created_start: filter?.date_start,
              date_created_end: filter?.date_end,
              status: "Confirmed",
              with_sum_amount_incl_tax: true,
              page_size: 1,
            })}
          >
            {(data) => {
              const value = (get(data, "sum_amount_incl_tax") || "0") as string;

              return (
                <WrapperTableCell loading={loading} textAlign="center">
                  <NumberFormat value={parseFloat(value)} />
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },
  ];
};

export default columns;
