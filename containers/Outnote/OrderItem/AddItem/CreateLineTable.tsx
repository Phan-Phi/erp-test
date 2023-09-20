import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

import { get } from "lodash";
import DynamicMessage from "messages";
import { Box, Stack, MenuItem, Typography } from "@mui/material";

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
  TableHeaderForSelection,
  TableCellForSelection,
  TableCellForAvatar,
} from "components/TableV3";
import { AddButton, Link, NumberFormat } from "components";
import { CommonTableProps, Unit as IUnit } from "interfaces";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateLineTableProps = CommonTableProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1> &
  Record<string, any>;

const CreateLineTable = (props: CreateLineTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    setListSelectedRow,
    ...restProps
  } = props;

  const { formatMessage } = useIntl();

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
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(row, "original.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: "Mã hàng",
        accessor: "variant.editable_sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      // {
      //   Header: <FormattedMessage id={`table.variant_sku`} />,
      //   accessor: "variant_sku",
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;

      //     const value = get(row, "original.variant.sku");

      //     return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      //   },
      // },
      {
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
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
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.available_quantity`} />
          </Box>
        ),
        accessor: "available_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, editData } = props;

          const id = get(row, "original.id");
          const quantity = get(row, "original.quantity");
          const allocatedQuantity = get(row, "original.allocated_quantity");
          const remainingQuantity = quantity - allocatedQuantity;
          let value = 0;

          const mainUnit = get(row, "original.variant.unit");
          let extendUnit: IUnit[] = get(row, "original.variant.units");

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

          const selectedUnit = get(editData, `current.${id}.unit`);

          if (selectedUnit) {
            const unitObj = mergeUnit.find((el) => {
              return el.unit === selectedUnit;
            });

            if (unitObj) {
              value = Math.floor(remainingQuantity / unitObj.multiply);
            } else {
              value = remainingQuantity;
            }
          } else {
            value = remainingQuantity;
          }

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box minWidth={150}>
            <FormattedMessage id={`table.unit`} />
          </Box>
        ),
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, editData, updateEditRowDataHandler, activeEditRowHandler } =
            props;

          const id = get(row, "original.variant.id");
          const columnId = get(cell, "column.id");
          const mainUnit = get(row, "original.variant.unit");
          let extendUnit: IUnit[] = get(row, "original.variant.units");

          let mergeUnit = [mainUnit];

          extendUnit.forEach((el) => {
            mergeUnit.push(el.unit);
          });

          if (get(mergeUnit, "length") <= 1) {
            return <WrapperTableCell>{get(mergeUnit, "[0]") || "-"}</WrapperTableCell>;
          }

          return (
            <TableCellForEdit
              {...{
                inputType: "select",
                renderItem() {
                  return mergeUnit.map((el) => {
                    return (
                      <MenuItem key={el} value={el}>
                        {el}
                      </MenuItem>
                    );
                  });
                },
                value: get(editData, `current.${id}.${columnId}`) || mainUnit,
                onChange(value) {
                  activeEditRowHandler(row)();

                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
              }}
            />
          );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.unit_quantity`} />
          </Box>
        ),
        accessor: "unit_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, editData, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const quantity = get(row, "original.quantity");
          const allocatedQuantity = get(row, "original.allocated_quantity");
          const remainingQuantity = quantity - allocatedQuantity;
          let value = 0;

          const mainUnit = get(row, "original.variant.unit");
          let extendUnit: IUnit[] = get(row, "original.variant.units");

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

          const selectedUnit: string = get(editData, `current.${id}.unit`);

          if (selectedUnit) {
            const unitObj = mergeUnit.find((el) => {
              return el.unit === selectedUnit;
            });

            if (unitObj == undefined) {
              value = remainingQuantity;
            } else {
              value = Math.floor(remainingQuantity / unitObj.multiply);
            }
          } else {
            value = remainingQuantity;
          }

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

                    if (floatValue <= value) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
              }}
            />
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack columnGap={1} flexDirection="row" alignItems="center">
              <AddButton
                disabled={!!addLoading[id]}
                onClick={() => {
                  addHandler?.({
                    data: [row],
                  });
                }}
              />
            </Stack>
          );
        },
        width: 120,
        maxWidth: 120,
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
    useSticky,
    useRowSelect
  );

  useEffect(() => {
    setListSelectedRow(table.selectedFlatRows);
  }, [table.selectedFlatRows.length]);

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                setListSelectedRow(selectedRows);

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>
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

export default CreateLineTable;
