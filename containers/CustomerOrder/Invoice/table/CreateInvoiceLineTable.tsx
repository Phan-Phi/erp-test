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
import { Link, NumberFormat, WrapperTable } from "components";

import { CommonTableProps, WAREHOUSE_ITEM, Unit as IUnit } from "interfaces";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateInvoiceLineTableProps = CommonTableProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1> &
  Record<string, any>;

const CreateInvoiceLineTable = (props: CreateInvoiceLineTableProps) => {
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
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
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
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.variant.name");

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
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.price`} />
          </Box>
        ),
        accessor: "price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.unit_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={80}>
            <FormattedMessage id={`table.available_quantity`} />
          </Box>
        ),
        accessor: "available_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const warehouseData: WAREHOUSE_ITEM[] = props.warehouseData;

          const selectedUnit = get(row, "original.unit");
          const variantId = get(row, "original.variant.id");

          const recordLine = warehouseData.find((el) => {
            return get(el, "variant.id") == variantId;
          });

          if (recordLine == null) {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={0} suffix="" />
              </WrapperTableCell>
            );
          }

          const warehouseQuantity = get(recordLine, "quantity");
          const warehouseAllocatedQuantity = get(recordLine, "allocated_quantity");

          const remainingQuantity = warehouseQuantity - warehouseAllocatedQuantity;

          const mainUnit = get(recordLine, "variant.unit");
          let extendUnit: IUnit[] = get(recordLine, "variant.units");

          let mergeUnit = [
            {
              unit: mainUnit,
              multiply: 1,
            },
          ];

          extendUnit.forEach((el) => {
            mergeUnit.push({
              unit: el.unit,
              multiply: el.multiply,
            });
          });

          const unitObj = mergeUnit.find((el) => {
            return el.unit === selectedUnit;
          });

          if (unitObj == undefined) {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={0} suffix="" />
              </WrapperTableCell>
            );
          }

          const value = Math.floor(remainingQuantity / unitObj.multiply);

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
            <FormattedMessage id={`table.quantity`} />
          </Box>
        ),
        accessor: "quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const unitQuantity = get(row, "original.unit_quantity");

          const actualInvoiceUnitQuantity = get(
            row,
            "original.actual_invoice_unit_quantity"
          );

          const remainingQuantity = unitQuantity - actualInvoiceUnitQuantity;

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
            <FormattedMessage id={`table.unit_quantity`} />
          </Box>
        ),
        accessor: "unit_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, editData, updateEditRowDataHandler, invoice } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");

          const warehouseData: WAREHOUSE_ITEM[] = props.warehouseData;

          const variantId = get(row, "original.variant.id");

          const recordLine = warehouseData.find((el) => {
            return get(el, "variant.id") == variantId;
          });

          if (recordLine == undefined) {
            return null;
          }

          const warehouseQuantity = get(recordLine, "quantity");
          const warehouseAllocatedQuantity = get(recordLine, "allocated_quantity");

          const remainingQuantity = warehouseQuantity - warehouseAllocatedQuantity;

          if (remainingQuantity === 0) {
            return null;
          }

          const unitQuantity = get(row, "original.unit_quantity");

          const actualInvoiceUnitQuantity = get(
            row,
            "original.actual_invoice_unit_quantity"
          );

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                value: get(editData, `current.${id}.${columnId}`) || "",
                NumberFormatProps: {
                  allowNegative: false,
                  suffix: "",
                  isAllowed: ({ floatValue }) => {
                    if (floatValue === undefined) {
                      return true;
                    }

                    if (
                      floatValue <= remainingQuantity &&
                      floatValue <= unitQuantity - actualInvoiceUnitQuantity
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                onChange: (value) => {
                  // * unit_quantity

                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });

                  // * line id

                  updateEditRowDataHandler?.({
                    value: id,
                    row,
                    keyName: "line",
                  });

                  // * warehouse id

                  const warehouseId = get(recordLine, "warehouse.id");

                  updateEditRowDataHandler?.({
                    value: warehouseId,
                    row,
                    keyName: "warehouse",
                  });

                  // * record Id

                  const recordId = get(recordLine, "id");

                  updateEditRowDataHandler?.({
                    value: recordId,
                    row,
                    keyName: "record",
                  });

                  // * invoice Id

                  const invoiceId = get(invoice, "id");

                  updateEditRowDataHandler?.({
                    value: invoiceId,
                    row,
                    keyName: "invoice",
                  });
                },
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

export default CreateInvoiceLineTable;
