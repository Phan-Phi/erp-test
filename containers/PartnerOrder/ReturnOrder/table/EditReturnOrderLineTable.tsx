import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

import { CommonTableProps } from "interfaces";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForEdit,
  TableCellForAvatar,
} from "components/TableV3";
import { NumberFormat, WrapperTable } from "components";
import { ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type EditReturnOrderLineTableProps =
  CommonTableProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1> & Record<string, any>;

const EditReturnOrderLineTable = (props: EditReturnOrderLineTableProps) => {
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
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(
            row,
            "original.receipt_order_quantity.line.variant.primary_image.product_small"
          );

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.receipt_order_quantity.line.variant_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 3,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.receipt_quantity`} />
          </Box>
        ),
        accessor: "receipt_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const currentReturnQuantity = get(row, "original.quantity");
          const totalQuantity = get(row, "original.receipt_order_quantity.quantity");
          const actualReturnQuantity = get(
            row,
            "original.receipt_order_quantity.actual_return_quantity"
          );
          const remainingReturnQuantity =
            totalQuantity - actualReturnQuantity + currentReturnQuantity;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={remainingReturnQuantity} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.returned_quantity`} />
          </Box>
        ),
        accessor: "returned_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const returnedQuantity =
            get(row, "original.receipt_order_quantity.return_quantity") || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={returnedQuantity} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.return_quantity`} />
          </Box>
        ),
        accessor: "return_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const {
            row,
            cell,
            editData,
            orderStatus,
            writePermission,
            updateEditRowDataHandler,
          } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const currentReturnQuantity = get(row, "original.quantity");

          const totalQuantity = get(row, "original.receipt_order_quantity.quantity");
          const actualReturnQuantity = get(
            row,
            "original.receipt_order_quantity.actual_return_quantity"
          );
          const remainingReturnQuantity =
            totalQuantity - actualReturnQuantity + currentReturnQuantity;

          if (orderStatus === "Draft" && writePermission) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "number",
                  value: get(editData, `current.${id}.quantity`) || currentReturnQuantity,
                  onChange: (value) => {
                    updateEditRowDataHandler?.({
                      value,
                      row,
                      keyName: columnId,
                    });
                  },
                  NumberFormatProps: {
                    suffix: "",
                    allowNegative: false,
                    isAllowed: ({ floatValue }) => {
                      if (floatValue === undefined) return true;

                      if (floatValue <= remainingReturnQuantity) return true;

                      return false;
                    },
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={currentReturnQuantity} suffix="" />
              </WrapperTableCell>
            );
          }
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

export default EditReturnOrderLineTable;
