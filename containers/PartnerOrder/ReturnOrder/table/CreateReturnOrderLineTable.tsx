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
  TableCellForEdit,
  TableCellForAvatar,
} from "components/TableV3";
import { NumberFormat, WrapperTable } from "components";

import { CommonTableProps } from "interfaces";
import { ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateReturnOrderLineTableProps =
  CommonTableProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1> & Record<string, any>;

const CreateReturnOrderLineTable = (props: CreateReturnOrderLineTableProps) => {
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
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const image = get(row, "original.line.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.line.variant_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 3,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.availableReturnQuantity`} />
          </Box>
        ),
        accessor: "availableReturnQuantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const quantity = get(row, "original.quantity");
          const actualReturnQuantity = get(row, "original.actual_return_quantity");
          const remainingQuantity = quantity - actualReturnQuantity;
          const value = remainingQuantity || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
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
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.return_quantity") || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.return_quantity`} />,
        accessor: "return_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, editData } = props;
          const columnId = get(cell, "column.id");
          const quantity = get(row, "original.quantity");
          const actualReturnQuantity = get(row, "original.actual_return_quantity");
          const remainingQuantity = quantity - actualReturnQuantity;
          const id = get(row, "original.id");

          return (
            <TableCellForEdit
              {...{
                inputType: "number",

                NumberFormatProps: {
                  allowNegative: false,
                  suffix: "",
                  isAllowed: ({ floatValue }) => {
                    if (floatValue === undefined) return true;

                    if (floatValue <= remainingQuantity) return true;

                    return false;
                  },
                },
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },

                value: get(editData, `current.${id}.quantity`) || "",
              }}
            />
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

export default CreateReturnOrderLineTable;
