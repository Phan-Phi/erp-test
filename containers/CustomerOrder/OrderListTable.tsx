import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, Stack, Typography } from "@mui/material";

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
} from "components/TableV3";
import { DeleteButton, Link, LoadingButton, ViewButton } from "components";

import { useChoice } from "hooks";
import DynamicMessage from "messages";
import { EDIT, ORDERS } from "routes";
import { PARTNER_ITEM, CommonTableProps } from "interfaces";
import { ADMIN_ORDER_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { formatDate, formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";

type OrderListTableProps = CommonTableProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1> &
  Record<string, any>;

const OrderListTable = (props: OrderListTableProps) => {
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
        Cell: (props: PropsWithChildren<CellProps<PARTNER_ITEM, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },
      {
        Header: <FormattedMessage id={`table.orderSid`} />,
        accessor: "orderSid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_placed`} />,
        accessor: "date_placed",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.date_placed");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const { order_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(order_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.receiver_name`} />,
        accessor: "receiver_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.receiver_name");

          return (
            <WrapperTableCell>
              <Link
                href={"#"}
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGotoHandler?.(row);
                }}
              >
                {value}
              </Link>
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.receiver_phone_number");

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.shipping_address`} />,
        accessor: "shipping_address",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.shipping_address.line1");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 250,
      },
      {
        Header: (
          <Box width={200} maxWidth={200}>
            Ghi chú đơn hàng
          </Box>
        ),
        accessor: "customer_notes",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.customer_notes");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.owner_name`} />,
        accessor: "owner_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.owner_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box width={100} maxWidth={100}>
            <FormattedMessage id={`table.channel`} />
          </Box>
        ),
        accessor: "channel",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.channel.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      // {
      //   Header: <FormattedMessage id={`table.shipping_method_name`} />,
      //   accessor: "shipping_method_name",
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;

      //     const value = get(row, "original.shipping_method_name");

      //     return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      //   },
      // },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission } = props;

          const status = get(row, "original.status");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${ORDERS}/${EDIT}/${row.original?.id}`} />

              {status === "Draft" && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 120,
        maxWidth: 120,
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

export default OrderListTable;
