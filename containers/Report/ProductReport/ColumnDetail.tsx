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
import { formatDate } from "libs";
import { NumberFormat } from "components";
import { CommonTableProps } from "interfaces";

type TableProps = CommonTableProps<any> & Record<string, any>;

export default function ColumnDetail(props: TableProps) {
  const {
    filter,
    type,
    data,
    count,
    maxHeight,
    isLoading,
    dataInvoiceQuantity,
    dataInvoice,
    pagination,
    onPageChange,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    onViewDetailHandler2,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    if (type === "sale") {
      return [
        {
          Header: <FormattedMessage id={`table.sid`} />,
          accessor: "sid",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sid");

            if (value == undefined) {
              return <WrapperTableCell>{}</WrapperTableCell>;
            } else {
              return <WrapperTableCell>{value}</WrapperTableCell>;
            }
          },
        },

        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "time",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.date_created");
            return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.quantity_count");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value} suffix="" />
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
            const value = get(row, "original.amount_before_discounts.incl_tax");
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
            const value = get(row, "original.amount.incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.difference`} />,
          accessor: "difference",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.amount_before_discounts.incl_tax") -
                      get(row, "original.amount.incl_tax")
                    ).toFixed(2)
                  )}
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
          Header: <FormattedMessage id={`table.warehouseName`} />,
          accessor: "warehouseName",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.warehouse_name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.quantity`} />,
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");
            return <WrapperTableCell textAlign="right">{quantity}</WrapperTableCell>;
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
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={
                    parseFloat(get(row, "original.current_price.incl_tax")) * quantity
                  }
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
          accessor: "warehouseValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={
                    parseFloat(get(row, "original.current_base_price.incl_tax")) *
                    quantity
                  }
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, []);

  const columnsTotal = useMemo(() => {
    if (type === "sale") {
      if (dataInvoiceQuantity[0] == undefined && dataInvoice[0] == undefined) return [];

      return [
        {
          accessor: "endDebt",
          colSpan: 2,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell textAlign="left" fontWeight={700}>
                {"SL mặt hàng: "}
                <NumberFormat value={get(data, "count")} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.results[0].quantity_count");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                {" "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "price",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const data = dataInvoiceQuantity[0];
            const value = get(data, "sum_amount_before_discounts_incl_tax");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const data = dataInvoiceQuantity[0];
            const value = get(data, "sum_amount_incl_tax");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "difference",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const data = dataInvoiceQuantity[0];
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(
                    (
                      get(data, "sum_amount_before_discounts_incl_tax") -
                      get(data, "sum_amount_incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "warehouse_value") {
      if (dataInvoiceQuantity[0] == undefined && dataInvoice[0] == undefined) return [];
      return [
        {
          accessor: "endDebt",
          colSpan: 1,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");
            if (dataInvoiceQuantity.length === 0) {
              return (
                <WrapperTableCell textAlign="left" fontWeight={700}></WrapperTableCell>
              );
            }
            return (
              <WrapperTableCell textAlign="left" fontWeight={700}>
                {"SL kho: "}
                {dataInvoiceQuantity[0].count}
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "quantity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                {quantity}
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "none",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell textAlign="right"></WrapperTableCell>;
          },
        },

        {
          accessor: "sellValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={
                    parseFloat(get(row, "original.current_price.incl_tax")) * quantity
                  }
                />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "costPrice",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.current_base_price.incl_tax");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "warehouseValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const quantity =
              get(row, "original.beginning_quantity") +
              get(row, "original.input_quantity") -
              get(row, "original.output_quantity");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={
                    parseFloat(get(row, "original.current_base_price.incl_tax")) *
                    quantity
                  }
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, [dataInvoiceQuantity]);

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
      data: dataInvoice,
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
