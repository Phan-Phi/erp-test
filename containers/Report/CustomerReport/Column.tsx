import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";

import { cloneDeep, get, set } from "lodash";
import { FormattedMessage } from "react-intl";
import { useMemo, PropsWithChildren } from "react";
import { EDIT, WAREHOUSES } from "routes";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import { useTable, useSortBy, CellProps } from "react-table";
import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellForSelection,
  TableCellWithFullAddress,
  TableContainer,
  TableHead,
  TableHeaderForSelection,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import { CommonTableProps } from "interfaces";
import { ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { formatDate } from "libs";
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
    if (type === "sale") {
      return [
        {
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
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
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.name");

            return <WrapperTableCell>{value}</WrapperTableCell>;
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
                      get(row, "original.net_revenue.incl_tax") -
                      get(row, "original.revenue.incl_tax")
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

            const value = get(row, "original.base_amount");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value.incl_tax)} />
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

    if (type === "debt") {
      return [
        {
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
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
          Header: <FormattedMessage id={`table.beginningDebt`} />,
          accessor: "beginningDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.credit.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.credit`} />,
          accessor: "beginning_debt_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.beginning_debt_amount.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.debit`} />,
          accessor: "debit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.debit.incl_tax");

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.endDebt`} />,
          accessor: "endDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.beginning_debt_amount.incl_tax")) +
                      parseFloat(get(row, "original.credit.incl_tax")) -
                      parseFloat(get(row, "original.debit.incl_tax"))
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
      if (dataTotal[0] == undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL khách hàng: "}
                <NumberFormat value={value} suffix="" />
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
            const value = get(row, "original.sum_net_revenue_incl_tax");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
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
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL khách hàng: "}
                <NumberFormat value={value} suffix="" />
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
              <WrapperTableCell fontWeight={700} textAlign="right">
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

        {
          Header: <FormattedMessage id={`table.net_revenue`} />,
          accessor: "net_revenue",
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

        {
          Header: <FormattedMessage id={`table.base_amount`} />,
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
                      get(row, "original.sum_net_revenue_incl_tax") -
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

    if (type === "debt") {
      if (dataTotal[0] == undefined) return [];
      return [
        {
          Header: <FormattedMessage id={`table.customer`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL khách hàng: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.beginningDebt`} />,
          accessor: "beginningDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_beginning_debt_amount");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.credit`} />,
          accessor: "beginning_debt_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_credit");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.debit`} />,
          accessor: "debit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sum_debit");

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.endDebt`} />,
          accessor: "endDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_beginning_debt_amount")) +
                      parseFloat(get(row, "original.sum_credit")) -
                      parseFloat(get(row, "original.sum_debit"))
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
