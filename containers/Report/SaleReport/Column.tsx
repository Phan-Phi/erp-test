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
import HeadTitleTable from "components/HeadTitleTable";

type TableProps = CommonTableProps<any> & Record<string, any>;

export default function Column(props: TableProps) {
  const {
    dataTotal,
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    onViewDetailHandler,
    renderHeaderContentForSelectedRow,
    type,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    if (type === "time") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.date_start");
            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={formatDate(value, "dd/MM/yyyy") || "-"} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.revenue");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.net_revenue");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "profit") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.date_start");
            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={formatDate(value, "dd/MM/yyyy") || "-"} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.commodity`} />,
          accessor: "total",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.revenue");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.revenue.incl_tax") -
                      get(row, "original.net_revenue.incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue2",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.net_revenue");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
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

            const value = get(row, "original.base_amount");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
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

            const value = get(row, "original.profit");

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
      ];
    }

    if (type === "discount") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.date_start");
            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={formatDate(value, "dd/MM/yyyy") || "-"} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.totalInvoice`} />,
          accessor: "invoice_count",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.invoice_count");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} suffix="" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.invoiceValue`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.net_revenue");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "discount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.revenue.incl_tax") -
                      get(row, "original.net_revenue.incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, []);
  const columnsTotal = useMemo(() => {
    if (type === "time") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "sum_revenue_incl_tax",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_revenue_incl_tax");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "sum_net_revenue_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_net_revenue_incl_tax");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "profit") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.commodity`} />,
          accessor: "sum_revenue_incl_tax",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_revenue_incl_tax");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_revenue_incl_tax") -
                      get(row, "original.sum_net_revenue_incl_tax")
                    ).toFixed(2)
                  )}
                  suffix=" ₫"
                />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.commodity`} />,
          accessor: "sum_net_revenue_incl_tax",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_net_revenue_incl_tax");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.commodity`} />,
          accessor: "sum_base_amount_incl_tax",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_base_amount_incl_tax");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} suffix=" ₫" />
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },

        {
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "total_profit",
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
                  suffix=" ₫"
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "discount") {
      return [
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "total_date_start",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.totalInvoice`} />,
          accessor: "total_invoice_count",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_invoice_count");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                {value}
              </WrapperTableCell>
            );
          },
          textAlign: "right",
        },
        {
          Header: <FormattedMessage id={`table.invoiceValue`} />,
          accessor: "total_net_revenue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_net_revenue_incl_tax");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "total_discount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_revenue_incl_tax") -
                      get(row, "original.sum_net_revenue_incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
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
