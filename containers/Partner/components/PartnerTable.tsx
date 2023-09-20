import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { cloneDeep, get, set } from "lodash";
import { Box, Stack, Typography } from "@mui/material";

import {
  DeleteButton,
  NumberFormat,
  ViewButton,
  AddLinkButton,
  LoadingButton,
} from "components";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForSelection,
  TableHeaderForSelection,
  TableCellWithFullAddress,
  WrapperTableHeaderCell,
} from "components/TableV3";

import DynamicMessage from "messages";
import { EDIT, PARTNERS } from "routes";
import { formatPhoneNumber } from "libs";
import { CommonTableProps } from "interfaces";
import { ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type PartnerTableProps = CommonTableProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1> &
  Record<string, any>;

const PartnerTable = (props: PartnerTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    deleteHandler,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        accessor: "selection",
        Header: (props) => {
          const { getToggleAllRowsSelectedProps } = props;

          return (
            <TableHeaderForSelection
              getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
            />
          );
        },
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },
      {
        Header: <FormattedMessage id={`table.partnerName`} />,
        accessor: "partnerName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 250,
      },
      {
        Header: <FormattedMessage id={`table.address`} />,
        accessor: "address",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.primary_address.line1");

          const primaryAddress = get(row, "original.primary_address");

          const clonePrimaryAddress = cloneDeep(primaryAddress);

          set(clonePrimaryAddress, "address", value);

          return <TableCellWithFullAddress data={clonePrimaryAddress} />;
        },
        maxWidth: 300,
      },
      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.primary_address.phone_number");

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },
      {
        Header: (props) => {
          const { column } = props;

          return (
            <WrapperTableHeaderCell isSortBy column={column}>
              <FormattedMessage id={`table.total_debt_amount_partner`} />
            </WrapperTableHeaderCell>
          );
        },
        accessor: "total_debt_amount.incl_tax",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.total_debt_amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.max_debt`} />,
        accessor: "max_debt",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.max_debt.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.total_purchase`} />,
        accessor: "total_purchase",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.total_purchase.incl_tax") || "0";

          return (
            <WrapperTableCell>
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission } = props;

          const isUsed = get(row, "original.is_used");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${PARTNERS}/${EDIT}/${row.original.id}`} />

              <AddLinkButton href={`/${PARTNERS}/${row.original.id}`} />

              {!isUsed && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 180,
        maxWidth: 180,
        sticky: "right",
      },
    ];
  }, []);

  const { formatMessage, messages } = useIntl();

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky,
    useRowSelect
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};

export default PartnerTable;
