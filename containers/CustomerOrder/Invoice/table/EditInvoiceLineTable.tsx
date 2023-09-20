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
import { CommonTableProps, Unit as IUnit } from "interfaces";
import { ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type EditInvoiceLineTableProps =
  CommonTableProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1> & Record<string, any>;

const EditInvoiceLineTable = (props: EditInvoiceLineTableProps) => {
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
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
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
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.line.variant_name");

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
        colSpan: 2,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.price`} />
          </Box>
        ),
        accessor: "price",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
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
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.line.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
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
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const unitQuantity = get(row, "original.line.unit_quantity");
          const currentUnitQuantity = get(row, "original.unit_quantity");
          const actualInvoiceUnitQuantity = get(
            row,
            "original.line.actual_invoice_unit_quantity"
          );

          const canAdjustQuantity =
            unitQuantity - (actualInvoiceUnitQuantity - currentUnitQuantity);

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={canAdjustQuantity} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.warehouse_quantity`} />
          </Box>
        ),
        accessor: "warehouse_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const selectedUnit = get(row, "original.line.unit");

          const quantity = get(row, "original.record.quantity");
          const allocatedQuantity = get(row, "original.record.allocated_quantity");

          const remainingQuantity = quantity - allocatedQuantity;

          const mainUnit = get(row, "original.line.variant.unit");
          let extendUnit: IUnit[] = get(row, "original.line.variant.units");

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
            return null;
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
            <FormattedMessage id={`table.currentExportQuantity`} />
          </Box>
        ),
        accessor: "currentExportQuantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.unit_quantity") || 0;

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
            <FormattedMessage id={`table.adjust_quantity`} />
          </Box>
        ),
        accessor: "adjust_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, editData, updateEditRowDataHandler } = props;

          // * UNIT QUANTITY

          const id = get(row, "original.id");
          const quantity = get(row, "original.line.unit_quantity");

          const currentUnitQuantity = get(row, "original.unit_quantity");

          const actualInvoiceUnitQuantity = get(
            row,
            "original.line.actual_invoice_unit_quantity"
          );

          const canAdjustQuantity =
            quantity - (actualInvoiceUnitQuantity - currentUnitQuantity);

          // * WAREHOUSE QUANTITY

          const selectedUnit = get(row, "original.line.unit");

          const warehouseQuantity = get(row, "original.record.quantity");

          const allocatedQuantity = get(row, "original.record.allocated_quantity");

          const remainingQuantity = warehouseQuantity - allocatedQuantity;

          const mainUnit = get(row, "original.line.variant.unit");
          let extendUnit: IUnit[] = get(row, "original.line.variant.units");

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
            return null;
          }

          const avaiableInWarehouse = Math.floor(remainingQuantity / unitObj.multiply);

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: "unit_quantity",
                  });

                  updateEditRowDataHandler?.({
                    value: id,
                    row,
                    keyName: "id",
                  });
                },
                value:
                  get(editData, `current.${id}.unit_quantity`) || currentUnitQuantity,
                NumberFormatProps: {
                  allowNegative: false,
                  suffix: "",
                  isAllowed: ({ floatValue }) => {
                    if (floatValue === undefined) {
                      return true;
                    }

                    let maxValue = Math.min(avaiableInWarehouse, canAdjustQuantity);

                    if (floatValue <= maxValue) {
                      return true;
                    } else {
                      return false;
                    }
                  },
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

export default EditInvoiceLineTable;
