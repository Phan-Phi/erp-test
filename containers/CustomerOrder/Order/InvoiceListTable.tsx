import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

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
import { NumberFormat, ViewButton } from "components";

import { EDIT, ORDERS } from "routes";
import { CommonTableProps } from "interfaces";
import { useChoice, usePermission } from "hooks";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type InvoiceListTableProps = CommonTableProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1> &
  Record<string, any>;

const InvoiceListTable = (props: InvoiceListTableProps) => {
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

  const { hasPermission: readOrder } = usePermission("read_order");

  const columns = useMemo(() => {
    return [
      {
        Header: <Box>Mã hóa đơn</Box>,
        accessor: "sid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Ngày tạo</Box>,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Trạng thái</Box>,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;
          const { invoice_statuses } = useChoice();
          const displayValue = getDisplayValueFromChoiceItem(invoice_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Trạng thái giao hàng</Box>,
        accessor: "shipping_status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          const { shipping_statuses } = useChoice();
          const displayValue = getDisplayValueFromChoiceItem(shipping_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Người giao hàng</Box>,
        accessor: "shipper_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="center">COD</Box>,
        accessor: "cod",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

          return (
            <WrapperTableCell textAlign="center">
              <CircleIcon
                sx={{
                  color,
                }}
              />
            </WrapperTableCell>
          );
        },
        width: 100,
        maxWidth: 100,
      },
      {
        Header: <Box textAlign="right">Tổng giá trị</Box>,
        accessor: "total_price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const amount_incl_tax = get(row, "original.amount.incl_tax") || "0";

          const shipping_charge_incl_tax =
            get(row, "original.shipping_charge.incl_tax") || "0";

          const surcharge_incl_tax = get(row, "original.surcharge.incl_tax") || "0";

          const total_price =
            parseFloat(amount_incl_tax) +
            parseFloat(shipping_charge_incl_tax) +
            parseFloat(surcharge_incl_tax);

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={total_price} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box>Thao tác</Box>,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          return (
            <Box>
              {readOrder && (
                <ViewButton href={`/${ORDERS}/${EDIT}/${row.original?.order}`} />
              )}
            </Box>
          );
        },
        width: 150,
        maxWidth: 150,
        sticky: "right",
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
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
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

export default InvoiceListTable;
