import { get } from "lodash";
import { Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import { NumberFormat } from "components";
import { CommonTableProps } from "interfaces";
import HeadTitleTable from "components/HeadTitleTable";

type TableProps = CommonTableProps<any> & Record<string, any>;

export default function Column(props: TableProps) {
  const {
    type,
    data,
    count,
    maxHeight,
    isLoading,
    dataTotal,
    pagination,
    onPageChange,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    onPageSizeChange,
    onViewDetailHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    if (type === "sale") {
      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sku");
            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={value} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.quantity");

            return <WrapperTableCell textAlign="right">{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.revenue.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.net_revenue.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "profit") {
      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sku");
            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.quantity");

            return <WrapperTableCell textAlign="right">{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.revenue.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.net_revenue.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.base_amount`} />,
          accessor: "base_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.base_amount.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.profit`} />,
          accessor: "profit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.net_revenue.incl_tax") -
                      get(row, "original.base_amount.incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.ros`} />,
          accessor: "ros",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      ((parseFloat(get(row, "original.net_revenue.incl_tax")) -
                        parseFloat(get(row, "original.base_amount.incl_tax"))) /
                        parseFloat(get(row, "original.net_revenue.incl_tax"))) *
                      100
                    ).toFixed(2)
                  )}
                  suffix="%"
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "warehouse_value") {
      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sku");
            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={value} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const currentQuantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={currentQuantity} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.price`} />,
          accessor: "price",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.current_price.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.sellValue`} />,
          accessor: "sellValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.current_price.incl_tax")) *
                      (parseFloat(get(row, "original.beginning_quantity")) +
                        parseFloat(get(row, "original.input_quantity")) -
                        parseFloat(get(row, "original.output_quantity")))
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.costPrice`} />,
          accessor: "costPrice",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.current_base_price.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.warehouseValue`} />,
          accessor: "current_base_price",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.current_base_price.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "import_export_stock") {
      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sku");
            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.beginningStock`} />,
          accessor: "beginning_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.beginning_quantity");

            return <WrapperTableCell textAlign="right">{value}</WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.beginningValue`} />,
          accessor: "beginning_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.beginning_amount.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.importStock`} />,
          accessor: "input_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const currentQuantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");

            return (
              <WrapperTableCell textAlign="right">{currentQuantity}</WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "importStockValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.total_input_amount.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.exportStock`} />,
          accessor: "output_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.output_quantity");

            return <WrapperTableCell textAlign="right">{value}</WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.exportStockValue`} />,
          accessor: "exportStockValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.total_output_amount.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.endStock`} />,
          accessor: "endStock2",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const currentQuantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");

            return (
              <WrapperTableCell textAlign="right">{currentQuantity}</WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.endValue`} />,
          accessor: "endValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.total_output_amount.incl_tax")) -
                      parseFloat(get(row, "original.total_input_amount.incl_tax"))
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    return [];
  }, []);

  const columnsTotal = useMemo(() => {
    if (type === "sale") {
      if (dataTotal[0] == undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL mặt hàng: "}
                <NumberFormat value={get(row, "original.count")} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "productName",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_quantity");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_revenue_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_net_revenue_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "profit") {
      if (dataTotal[0] == undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL mặt hàng: "}
                <NumberFormat value={get(row, "original.count")} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "productName",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_quantity");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_revenue_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_net_revenue_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.base_amount`} />,
          accessor: "base_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_base_amount_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.profit`} />,
          accessor: "profit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_net_revenue_incl_tax") -
                      get(row, "original.sum_base_amount_incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.ros`} />,
          accessor: "ros",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      ((parseFloat(get(row, "original.sum_net_revenue_incl_tax")) -
                        parseFloat(get(row, "original.sum_base_amount_incl_tax"))) /
                        parseFloat(get(row, "original.sum_net_revenue_incl_tax"))) *
                      100
                    ).toFixed(2)
                  )}
                  suffix="%"
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "warehouse_value") {
      if (dataTotal[0] == undefined) return [];

      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");
            return (
              <WrapperTableCell fontWeight={700}>
                {"SL mặt hàng: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "productName",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const currentQuantity =
              get(row, "original.sum_beginning_quantity") +
              get(row, "original.sum_input_quantity") -
              get(row, "original.sum_output_quantity");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={currentQuantity} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.price`} />,
          accessor: "price",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.sellValue`} />,
          accessor: "sellValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.total_current_price_incl_tax_till_date_end");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value).toFixed()} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.costPrice`} />,
          accessor: "costPrice",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.warehouseValue`} />,
          accessor: "current_base_price",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(
              row,
              "original.total_current_base_price_incl_tax_till_date_end"
            );

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value).toFixed()} />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "import_export_stock") {
      if (dataTotal[0] == undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.sku`} />,
          accessor: "sku",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");
            return (
              <WrapperTableCell fontWeight={700}>
                {"SL mặt hàng: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.productName`} />,
          accessor: "productName",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell fontWeight={700}></WrapperTableCell>;
          },
        },

        {
          Header: <FormattedMessage id={`table.beginningStock`} />,
          accessor: "beginning_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_beginning_quantity");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.beginningValue`} />,
          accessor: "beginning_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_beginning_amount");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.importStock`} />,
          accessor: "input_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={get(row, "original.sum_input_quantity")} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "importStockValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_total_input_amount");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.exportStock`} />,
          accessor: "output_quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_output_quantity");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {value}
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.exportStockValue`} />,
          accessor: "exportStockValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_total_output_amount");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.endStock`} />,
          accessor: "endStock2",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_beginning_quantity")) +
                      parseFloat(get(row, "original.sum_input_quantity")) -
                      parseFloat(get(row, "original.sum_output_quantity"))
                    ).toFixed(2)
                  )}
                  suffix=""
                />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.endValue`} />,
          accessor: "endValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_beginning_amount")) +
                      parseFloat(get(row, "original.sum_total_input_amount")) -
                      parseFloat(get(row, "original.sum_total_output_amount"))
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    return [];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data: data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy
  );

  const tableTotal = useTable(
    {
      columns: columnsTotal as any,
      data: dataTotal,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
          </TableHead>
          <TableBody>
            <RenderBody isBackground={true} loading={isLoading} table={tableTotal} />
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
