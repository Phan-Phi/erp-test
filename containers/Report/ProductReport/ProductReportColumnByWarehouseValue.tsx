import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { Link, NumberFormat } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = [
  "sku",
  "productName",
  "quantity",
  "price",
  "sellValue",
  "costPrice",
  "warehouseValue",
];

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

        const beginningQuantity = get(row, "original.beginning_quantity") || 0;
        const inputQuantity = get(row, "original.input_quantity") || 0;
        const outputQuantity = get(row, "original.output_quantity") || 0;

        const value = beginningQuantity + inputQuantity - outputQuantity;

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.price`} />,
      accessor: "price",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.current_price.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.sellValue`} />,
      accessor: "sellValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const price = get(row, "original.current_price.incl_tax") || "0";

        const beginningQuantity = get(row, "original.beginning_quantity") || 0;
        const inputQuantity = get(row, "original.input_quantity") || 0;
        const outputQuantity = get(row, "original.output_quantity") || 0;

        const quantity = beginningQuantity + inputQuantity - outputQuantity;

        const value = quantity * parseFloat(price);

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.costPrice`} />,
      accessor: "costPrice",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.current_base_price.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.warehouseValue`} />,
      accessor: "warehouseValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const price = get(row, "original.current_base_price.incl_tax") || "0";

        const beginningQuantity = get(row, "original.beginning_quantity") || 0;
        const inputQuantity = get(row, "original.input_quantity") || 0;
        const outputQuantity = get(row, "original.output_quantity") || 0;

        const quantity = beginningQuantity + inputQuantity - outputQuantity;

        const value = quantity * parseFloat(price);

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
