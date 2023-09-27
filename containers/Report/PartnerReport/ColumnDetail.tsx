import { get, isEmpty } from "lodash";
import { Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps, useExpanded } from "react-table";

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
    partner,
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
    if (type === "import") {
      return [
        {
          Header: <FormattedMessage id={`table.sid`} />,
          id: "expander",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.sid");

            return (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                    cursor: "pointer",
                    color: "rgb(16,116,186)",
                  },
                })}
              >
                {value}
              </span>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.date_created`} />,
          accessor: "date_created",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.date_created");
            return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.importStock`} />,
          accessor: "importStock",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.item_count");

            return <WrapperTableCell>{value}</WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "importStockValue",
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
          Header: <FormattedMessage id={`table.returnValue`} />,
          accessor: "returnValue",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.total_transaction_in_amount.incl_tax");

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
            const value = get(row, "original.source");
            if (value == undefined) {
              return <WrapperTableCell>{}</WrapperTableCell>;
            } else {
              return <WrapperTableCell>{value.sid}</WrapperTableCell>;
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
                {value ? (
                  <FormattedMessage id={`permission_content_types.${value}`} />
                ) : null}
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.debt_amount`} />,
          accessor: "debt_amount",
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
    if (type === "import") {
      if (dataTotal[0] == undefined) return [];

      return [
        {
          accessor: "endDebt",
          textAlign: "right",
          colSpan: 3,
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;
            const value = get(row, "original.count");
            return (
              <WrapperTableCell fontWeight={700}>
                {"SL giao dịch: "}
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "importStockValue",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(get(partner, "purchase_amount.incl_tax"))}
                />
              </WrapperTableCell>
            );
          },
        },
        {
          accessor: "returnValue",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(get(partner, "return_amount.incl_tax"))}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }

    if (type === "debt") {
      if (dataTotal[0] === undefined) return [];

      return [
        {
          accessor: "endDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          accessor: "time",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return (
              <WrapperTableCell>
                {get(filter, "date_start") &&
                  formatDate(get(filter, "date_start") * 1000)}
              </WrapperTableCell>
            );
          },
        },

        {
          accessor: "transactionType",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return <WrapperTableCell>Dư nợ đầu kỳ</WrapperTableCell>;
          },
        },

        {
          accessor: "debt_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return (
              <WrapperTableCell fontWeight={700} textAlign="right">
                0
              </WrapperTableCell>
            );
          },
        },

        {
          Header: <FormattedMessage id={`table.endDebt`} />,
          accessor: "endDebt2",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return (
              <WrapperTableCell textAlign="right" fontWeight={700}>
                <NumberFormat
                  value={parseFloat(get(partner, "beginning_debt_amount.incl_tax"))}
                />
              </WrapperTableCell>
            );
          },
        },
      ];
    }
  }, [partner, dataTotal]);

  const columnQuatity = useMemo(() => {
    if (type === "import") {
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
    useSortBy,
    useExpanded
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

  const tableQuatity = useTable(
    {
      columns: columnQuatity as any,
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
            {type === "import" && (
              <RenderBody isBackground={true} loading={isLoading} table={tableTotal} />
            )}
            <RenderBody loading={isLoading} table={table} filter={filter} />

            {type === "debt" ? (
              <>
                <RenderBody loading={isLoading} table={tableTotal} />
                <RenderBody
                  isBackground={true}
                  loading={isLoading}
                  table={tableQuatity}
                />
              </>
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
