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
    dataTotal,
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
    if (type === "time") {
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
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "customer",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.order.receiver_name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
          accessor: "revenue",
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
      ];
    }

    if (type === "profit") {
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
          Header: <FormattedMessage id={`table.commodity`} />,
          accessor: "commodity",
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
                      get(row, "original.amount_before_discounts.incl_tax") -
                      get(row, "original.amount.incl_tax")
                    ).toFixed(2)
                  )}
                />
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
                      get(row, "original.amount.incl_tax") -
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
          Header: <FormattedMessage id={`table.is_staff`} />,
          accessor: "is_staff",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.order.owner_name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "customer",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.order.receiver_name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.invoiceValue`} />,
          accessor: "invoiceValue",
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
  }, []);

  const columnsTotal = useMemo(() => {
    if (type === "time") {
      if (dataTotal[0] == undefined) return [];

      return [
        {
          Header: <FormattedMessage id={`table.endDebt`} />,
          accessor: "endDebt",
          colSpan: 3,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell textAlign="left" fontWeight={700}>
                {"SL giao dịch: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "revenue",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_amount_before_discounts_incl_tax");

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
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
          accessor: "endDebt",
          colSpan: 2,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell textAlign="left" fontWeight={700}>
                {"SL giao dịch: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "commodity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_amount_before_discounts_incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "discount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_amount_before_discounts_incl_tax") -
                      get(row, "original.sum_amount_incl_tax")
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "net_revenue",
          textAlign: "right",

          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_amount_incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "base_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_base_amount_incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "profit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_amount_incl_tax") -
                      get(row, "original.sum_base_amount_incl_tax")
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
      if (dataTotal[0] == undefined) return [];
      return [
        {
          accessor: "endDebt",
          colSpan: 4,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell textAlign="left" fontWeight={700}>
                {"SL giao dịch: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "invoiceValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_amount_incl_tax");
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "discount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      get(row, "original.sum_amount_before_discounts_incl_tax") -
                      get(row, "original.sum_amount_incl_tax")
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
