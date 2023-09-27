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

export default function ColumDetail(props: TableProps) {
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
    ...restProps
  } = props;

  const columns = useMemo(() => {
    if (type === "sale") {
      return [
        {
          Header: <FormattedMessage id={`table.seller`} />,
          accessor: "seller",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sid");

            return <WrapperTableCell>{value}</WrapperTableCell>;
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
      ];
    }
  }, []);

  const columnsTotal = useMemo(() => {
    if (type === "sale") {
      if (dataTotal[0] === undefined) return [];
      return [
        {
          accessor: "seller",
          colSpan: 3,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell fontWeight={700}>
                {"SL giao dịch: "}
                <NumberFormat value={get(row, "original.count")} suffix="" />
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
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, [dataTotal]);

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
