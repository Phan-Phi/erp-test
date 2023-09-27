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
    if (type === "import") {
      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
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
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "purchase_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.purchase_amount.incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.returnValue`} />,
          accessor: "return_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.return_amount.incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
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

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.purchase_amount.incl_tax")) -
                      parseFloat(get(row, "original.return_amount.incl_tax"))
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
          Header: <FormattedMessage id={`table.partnerName`} />,
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

            const value = get(row, "original.beginning_debt_amount.incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.credit`} />,
          accessor: "credit",
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
    if (type === "import") {
      if (dataTotal[0] == undefined) return [];

      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_purchase_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_purchase_amount_incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_return_amount_incl_tax",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_return_amount_incl_tax");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    (
                      parseFloat(get(row, "original.sum_purchase_amount_incl_tax")) -
                      parseFloat(get(row, "original.sum_return_amount_incl_tax"))
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
      if (dataTotal[0] === undefined) return [];

      return [
        {
          Header: <FormattedMessage id={`table.partnerName`} />,
          accessor: "name",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            return <WrapperTableCell></WrapperTableCell>;
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_beginning_debt_amount",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_beginning_debt_amount");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_credit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_credit");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_sum_debit",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            const value = get(row, "original.sum_debit");
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          },
        },
        {
          Header: <FormattedMessage id={`table.importStockValue`} />,
          accessor: "total_endDebt",
          textAlign: "right",
          Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
            const { row } = props;

            return (
              <WrapperTableCell textAlign="right">
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
