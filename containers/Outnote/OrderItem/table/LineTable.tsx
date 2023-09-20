import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { Fragment, PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

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
  TableCellForEdit,
  TableHeaderForSelection,
  TableCellForSelection,
} from "components/TableV3";

import {
  Link,
  EditButton,
  CheckButton,
  CloseButton,
  DeleteButton,
  NumberFormat,
  WrapperTable,
  LoadingButton,
} from "components";

import DynamicMessage from "messages";
import { CommonTableProps, Unit as IUnit } from "interfaces";
import { ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type LineTableProps = CommonTableProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1> &
  Record<string, any>;

const LineTable = (props: LineTableProps) => {
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

  const { formatMessage, messages } = useIntl();

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
        Header: "Mã hàng",
        accessor: "variant.editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
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

      //     const value = get(row, "original.variant_sku");

      //     return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      //   },
      // },
      {
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.variant_name");

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
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.record_quantity`} />
          </Box>
        ),
        accessor: "record_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const selectedUnit = get(row, `original.unit`);
          const quantity = parseInt(get(row, "original.record.quantity"));
          const allocatedQuantity = parseInt(
            get(row, "original.record.allocated_quantity")
          );
          const remainingQuantity = quantity - allocatedQuantity;

          let value = 0;

          const mainUnit = get(row, "original.variant.unit");

          if (!mainUnit) {
            return null;
          }

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

          const unitObj = mergeUnit.find((el) => {
            return el.unit === selectedUnit;
          });

          if (unitObj == undefined) {
            return null;
          }

          value = Math.floor(remainingQuantity / unitObj.multiply);
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
            <FormattedMessage id={`table.unit_quantity`} />
          </Box>
        ),
        accessor: "unit_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const unitQuantity = parseInt(get(row, "original.unit_quantity")) || 0;
          const quantity = get(row, "original.quantity");

          const convertionRate = quantity / unitQuantity;

          const quantityInStock = get(row, "original.record.quantity");

          const allocatedQuantity = parseInt(
            get(row, "original.record.allocated_quantity")
          );
          const remainingQuantity =
            (quantityInStock - allocatedQuantity) / convertionRate;

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "number",
                  value: unitQuantity,
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
                    isAllowed: (values) => {
                      const { floatValue } = values;

                      if (floatValue === undefined) return true;

                      if (floatValue <= remainingQuantity) return true;

                      return false;
                    },
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={unitQuantity} suffix="" />
              </WrapperTableCell>
            );
          }

          //*
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
            activeEditRow,
            writePermission,
            activeEditRowHandler,
            removeEditRowDataHandler,
          } = props;

          const id = get(row, "original.id");

          return (
            <Stack columnGap={1} flexDirection="row" alignItems="center">
              {writePermission ? (
                activeEditRow[id] ? (
                  <Fragment>
                    <CheckButton
                      onClick={updateHandler([row])}
                      disabled={!!updateLoading[id]}
                    />

                    <CloseButton
                      disabled={!!updateLoading[id]}
                      onClick={removeEditRowDataHandler([row])}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <EditButton
                      disabled={!!updateLoading[id]}
                      onClick={activeEditRowHandler(row)}
                    />

                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler({
                          data: [row],
                        });
                      }}
                    />
                  </Fragment>
                )
              ) : null}
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

  return (
    <WrapperTable>
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

export default LineTable;
