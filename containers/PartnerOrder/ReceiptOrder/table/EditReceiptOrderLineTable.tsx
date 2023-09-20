import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";
import { parseISO } from "date-fns";

import { formatDate } from "libs";
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
import { EditCell, NumberFormat, WrapperTable } from "components";
import { ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type EditReceiptOrderLineTableProps =
  CommonTableProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1> & Record<string, any>;

const EditReceiptOrderLineTable = (props: EditReceiptOrderLineTableProps) => {
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
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.line.unit_price.incl_tax") || "0";

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
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const totalQuantity = get(row, "original.line.quantity");
          const actualReceiptQuantity = get(row, "original.line.actual_receipt_quantity");
          const currentQuantity = get(row, "original.quantity");

          const remainingQuantity =
            totalQuantity - actualReceiptQuantity + currentQuantity;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={remainingQuantity} suffix="" />
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
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
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
          const totalQuantity = get(row, "original.line.quantity");
          const actualReceiptQuantity = get(row, "original.line.actual_receipt_quantity");
          const currentQuantity = get(row, "original.quantity");
          const maximumQuantity = totalQuantity - actualReceiptQuantity + currentQuantity;

          if (orderStatus === "Draft" && writePermission) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "number",
                  value: get(editData, `current.${id}.quantity`) || currentQuantity,
                  allowNegative: false,
                  onChange: (value) => {
                    updateEditRowDataHandler?.({
                      value,
                      row,
                      keyName: columnId,
                    });
                  },
                  NumberFormatProps: {
                    suffix: "",
                    isAllowed: ({ floatValue }) => {
                      if (floatValue === undefined) {
                        return true;
                      }

                      if (floatValue <= maximumQuantity) {
                        return true;
                      } else {
                        return false;
                      }
                    },
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={currentQuantity} suffix="" />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: <FormattedMessage id={`table.expiration_date`} />,
        accessor: "expiration_date",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            row,
            cell,
            editData,
            updateEditRowDataHandler,
            activeEditRowHandler,
            orderStatus,
            writePermission,
          } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value: string = get(row, "original.expiration_date");

          if (orderStatus === "Draft" && writePermission) {
            return (
              <TableCellForPickDateTime
                value={get(editData, `current.${id}.expiration_date`) || parseISO(value)}
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
          } else {
            return <WrapperTableCell>{formatDate(value || new Date())}</WrapperTableCell>;
          }
        },
        minWidth: 275,
        maxWidth: 275,
      },
      {
        Header: <FormattedMessage id={`table.notes`} />,
        accessor: "notes",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            row,
            cell,
            editData,
            updateEditRowDataHandler,
            orderStatus,
            writePermission,
          } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const currentNotes = get(row, "original.notes") || "-";

          if (orderStatus === "Draft" && writePermission) {
            return (
              <EditCell
                {...{
                  row: row,
                  columnId,
                  updateEditRowDataHandler,
                  value: get(editData, `current.${id}.${columnId}`) || currentNotes,
                }}
              />
            );
          } else {
            return <WrapperTableCell>{currentNotes}</WrapperTableCell>;
          }
        },
        colSpan: 2,
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

export default EditReceiptOrderLineTable;
