import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";

import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";
import { NumberFormat, WrapperTable } from "components";
import { ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type AccountPayableTabProps = CommonTableProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1> &
  Record<string, any>;

const AccountPayableTab = (props: AccountPayableTabProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.debtRecordSid`} />,
        accessor: "debtRecordSid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.source.sid") || get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 3,
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value =
            get(row, "original.source.date_created") || get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.owner_name`} />,
        accessor: "owner_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.source.owner_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.debt_amount`} />,
        accessor: "debt_amount",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.debt_amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.total_debt_amount_at_time`} />,
        accessor: "total_debt_amount_at_time",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.total_debt_amount_at_time.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  return (
    <WrapperTable>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="flex-end">
          <TablePagination
            count={count}
            page={pagination.pageIndex}
            rowsPerPage={pagination.pageSize}
            onPageChange={(_, page) => {
              onPageChange(page);
            }}
            onRowsPerPageChange={onPageSizeChange}
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default AccountPayableTab;
