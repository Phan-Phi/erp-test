import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { NumberFormat } from "components";

import { formatDate } from "libs";

import { transformUrl } from "libs";
import { TableCellWithFetch, WrapperTableCell } from "components/TableV3";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

export const keys = ["sid", "time", "quantity", "price", "revenue", "difference"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sid`} />,
      accessor: "sid",
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
      Header: <FormattedMessage id={`table.quantity`} />,
      accessor: "quantity",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, variantSku } = props;

        const invoiceId = get(row, "original.id");

        return (
          <TableCellWithFetch
            url={transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
              variant_sku: variantSku,
              invoice: invoiceId,
              with_sum_unit_quantity: true,
              with_sum_amount_before_discounts_incl_tax: true,
              with_sum_amount_incl_tax: true,
              page_size: 1,
            })}
            loading={loading}
          >
            {(data) => {
              const value = get(data, "sum_unit_quantity") as string;

              return (
                <WrapperTableCell textAlign="center">
                  <NumberFormat
                    value={parseFloat(parseFloat(value).toFixed(2))}
                    suffix=""
                  />
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.price`} />,
      accessor: "customer",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, variantSku } = props;

        const invoiceId = get(row, "original.id");

        return (
          <TableCellWithFetch
            url={transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
              variant_sku: variantSku,
              invoice: invoiceId,
              with_sum_unit_quantity: true,
              with_sum_amount_before_discounts_incl_tax: true,
              with_sum_amount_incl_tax: true,
              page_size: 1,
            })}
            loading={loading}
          >
            {(data) => {
              const value = get(data, "sum_amount_before_discounts_incl_tax") as string;

              return (
                <WrapperTableCell textAlign="center">
                  <NumberFormat value={parseFloat(parseFloat(value).toFixed(2))} />
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.net_revenue`} />,
      accessor: "net_revenue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, variantSku } = props;

        const invoiceId = get(row, "original.id");

        return (
          <TableCellWithFetch
            url={transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
              variant_sku: variantSku,
              invoice: invoiceId,
              with_sum_unit_quantity: true,
              with_sum_amount_before_discounts_incl_tax: true,
              with_sum_amount_incl_tax: true,
              page_size: 1,
            })}
            loading={loading}
          >
            {(data) => {
              const value = get(data, "sum_amount_incl_tax") as string;

              return (
                <WrapperTableCell textAlign="center">
                  <NumberFormat value={parseFloat(parseFloat(value).toFixed(2))} />
                </WrapperTableCell>
              );
            }}
          </TableCellWithFetch>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.difference`} />,
      accessor: "difference",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, variantSku } = props;

        const invoiceId = get(row, "original.id");

        return (
          <TableCellWithFetch
            url={transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
              variant_sku: variantSku,
              invoice: invoiceId,
              with_sum_unit_quantity: true,
              with_sum_amount_before_discounts_incl_tax: true,
              with_sum_amount_incl_tax: true,
              page_size: 1,
            })}
            loading={loading}
          >
            {(data) => {
              const amountBeforeDiscount = get(
                data,
                "sum_amount_before_discounts_incl_tax"
              ) as string;

              const amount = get(data, "sum_amount_incl_tax") as string;

              return (
                <WrapperTableCell textAlign="center">
                  <NumberFormat
                    value={parseFloat(
                      (parseFloat(amountBeforeDiscount) - parseFloat(amount)).toFixed(2)
                    )}
                  />
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
