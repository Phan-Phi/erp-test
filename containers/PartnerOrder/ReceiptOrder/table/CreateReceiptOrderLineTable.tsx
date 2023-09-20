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
  TableCellForPickDateTime,
} from "components/TableV3";
import { NumberFormat, WrapperTable } from "components";
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateReceiptOrderLineTableProps =
  CommonTableProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1> & Record<string, any>;

const CreateReceiptOrderLineTable = (props: CreateReceiptOrderLineTableProps) => {
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
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const image = get(row, "original.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.variant_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.inputPrice`} />
          </Box>
        ),
        accessor: "inputPrice",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.unit_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.quantity`} />
          </Box>
        ),
        accessor: "quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const quantity = get(row, "original.quantity") || 0;
          const actualReceiptQuantity = get(row, "original.actual_receipt_quantity") || 0;

          const value = quantity - actualReceiptQuantity;

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
            <FormattedMessage id={`table.receipt_quantity`} />
          </Box>
        ),
        accessor: "receipt_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, editData, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const quantity = get(row, "original.quantity");
          const actualReceiptQuantity = get(row, "original.actual_receipt_quantity");
          const remainingReceiptQuantity = quantity - actualReceiptQuantity;

          return (
            <WrapperTableCell textAlign="right">
              <TableCellForEdit
                inputType="number"
                value={get(editData, `current.${id}.quantity`) || 0}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
                NumberFormatProps={{
                  suffix: "",
                  isAllowed: ({ floatValue }) => {
                    if (floatValue === undefined) {
                      return true;
                    }

                    if (floatValue <= remainingReceiptQuantity) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                }}
              />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box minWidth={275}>
            <FormattedMessage id={`table.expiration_date`} />
          </Box>
        ),
        accessor: "expiration_date",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, editData, updateEditRowDataHandler, activeEditRowHandler } =
            props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");

          return (
            <TableCellForPickDateTime
              value={get(editData, `current.${id}.expiration_date`) || new Date()}
              onChange={(value) => {
                activeEditRowHandler?.(row)?.();

                updateEditRowDataHandler?.({
                  value,
                  row,
                  keyName: columnId,
                });
              }}
            />
          );
        },
      },
      {
        Header: (
          <Box minWidth={100}>
            <FormattedMessage id={`table.notes`} />
          </Box>
        ),
        accessor: "notes",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, editData, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");

          return (
            <WrapperTableCell textAlign="center">
              <TableCellForEdit
                inputType="text"
                value={get(editData, `current.${id}.notes`) || ""}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            </WrapperTableCell>
          );
        },
        colSpan: 3,
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

export default CreateReceiptOrderLineTable;
