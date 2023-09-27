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
    dataInvoice,
    pagination,
    onPageChange,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    onPageSizeChange,
    beginningDebtAmount,
    renderHeaderContentForSelectedRow,
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

    if (type === "debt") {
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
          Header: <FormattedMessage id={`table.transactionType`} />,
          accessor: "transactionType",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.source_type");
            return (
              <WrapperTableCell>
                <FormattedMessage id={`permission_content_types.${value}`} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.amount`} />,
          accessor: "amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.debt_amount.incl_tax");
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
            const value = get(row, "original.total_debt_amount_at_time.incl_tax");
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
      return [];
    }

    if (type === "debt") {
      return [
        {
          accessor: "endDebt",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.time`} />,
          accessor: "time",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.date_created");
            return (
              <WrapperTableCell>
                {get(filter, "date_start") &&
                  formatDate(get(filter, "date_start") * 1000)}
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "endDebt2",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell>Dư nợ đầu kỳ</WrapperTableCell>;
          },
        },

        {
          accessor: "amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            return <WrapperTableCell textAlign="right">0</WrapperTableCell>;
          },
        },

        {
          accessor: "beginningDebtAmount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.date_created");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(beginningDebtAmount.toFixed(2))} />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, []);

  const columnQuatity = useMemo(() => {
    if (type === "sale") {
      return [];
    }
    if (type === "debt") {
      return [
        {
          accessor: "endDebt",
          colSpan: 5,
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
      data: dataInvoice,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy
  );

  const tableQuatity = useTable(
    {
      columns: columnQuatity as any,
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
            <RenderBody loading={isLoading} table={table} />
            {dataInvoice.length > 0 && (
              <RenderBody loading={isLoading} table={tableTotal} />
            )}

            {type === "debt" ? (
              <RenderBody isBackground={true} loading={isLoading} table={tableQuatity} />
            ) : null}
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
