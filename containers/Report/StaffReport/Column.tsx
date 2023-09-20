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
    renderHeaderContentForSelectedRow,
    onViewDetailHandler,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    if (type === "sale") {
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "seller",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return (
              <WrapperTableCell onClick={() => onViewDetailHandler(row)}>
                <HeadTitleTable value={value} />
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
            const value = get(row, "original.revenue.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.revenue`} />,
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
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "seller",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.commodity`} />,
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
          Header: <FormattedMessage id={`table.discount`} />,
          accessor: "commodity",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.revenue.incl_tax")) -
                      parseFloat(get(row, "original.net_revenue.incl_tax"))
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
                      parseFloat(get(row, "original.net_revenue.incl_tax")) -
                      parseFloat(get(row, "original.base_amount.incl_tax"))
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
    if (type === "sale") {
      if (dataTotal[0] === undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "total_seller",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell>
                {"SL người bán: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_revenue_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_revenue_incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_net_revenue_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_net_revenue_incl_tax");
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
      if (dataTotal[0] === undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "total_seller",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL người bán: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_revenue_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_revenue_incl_tax");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_discount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_revenue_incl_tax")) -
                      parseFloat(get(row, "original.sum_net_revenue_incl_tax"))
                    ).toFixed(2)
                  )}
                />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_net_revenue_incl_tax",
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
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_base_amount_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_base_amount_incl_tax");
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_profit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_net_revenue_incl_tax")) -
                      parseFloat(get(row, "original.sum_base_amount_incl_tax"))
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
