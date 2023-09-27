import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { NumberFormat } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = [
  "sku",
  "productName",
  "beginningStock",
  "beginningValue",
  "importStock",
  "importStockValue",
  "exportStock",
  "exportStockValue",
  "endStock",
  "endValue",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sku`} />,
      accessor: "sku",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.sku") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
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
      Header: <FormattedMessage id={`table.beginningStock`} />,
      accessor: "beginningStock",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.beginning_quantity") || 0;

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.beginningValue`} />,
      accessor: "beginningValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.beginning_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.importStock`} />,
      accessor: "importStock",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.input_quantity") || 0;

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

        const value = get(row, "original.total_input_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.exportStock`} />,
      accessor: "exportStock",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.output_quantity") || 0;

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.exportStockValue`} />,
      accessor: "exportStockValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.total_output_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.endStock`} />,
      accessor: "endStock",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const beginningStock = get(row, "original.beginning_quantity") || 0;
        const inputStock = get(row, "original.input_quantity") || 0;
        const outStock = get(row, "original.output_quantity") || 0;

        const value = beginningStock + inputStock - outStock;

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={value} suffix="" />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.endValue`} />,
      accessor: "endValue",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const beginningAmount = get(row, "original.beginning_amount.incl_tax") || "0";

        const inputAmount = get(row, "original.total_input_amount.incl_tax") || "0";

        const outputAmount = get(row, "original.total_output_amount.incl_tax") || "0";

        const value =
          parseFloat(beginningAmount) +
          parseFloat(inputAmount) -
          parseFloat(outputAmount);

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
