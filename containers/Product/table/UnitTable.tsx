import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { Fragment, PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

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
  TableHeaderForSelection,
  TableCellForSelection,
} from "components/TableV3";
import {
  CheckButton,
  CloseButton,
  EditButton,
  NumberFormat,
  WrapperTable,
  DeleteButton,
} from "components";

import { ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type UnitTableProps = CommonTableProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1> &
  Record<string, any>;

const UnitTable = (props: UnitTableProps) => {
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
        Header: <FormattedMessage id="table.editable_sku" />,
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.editable_sku");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="text"
                value={value}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return <WrapperTableCell>{value}</WrapperTableCell>;
          }
        },
      },
      {
        Header: (
          <Box minWidth={100}>
            <FormattedMessage id="table.unit" />
          </Box>
        ),
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.unit");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="text"
                value={value}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return <WrapperTableCell>{value}</WrapperTableCell>;
          }
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={100}>
            <FormattedMessage id="table.multiply" />
          </Box>
        ),
        accessor: "multiply",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.multiply");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={value}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: "",
                }}
              />
            );
          } else {
            return <WrapperTableCell textAlign="right">{value}</WrapperTableCell>;
          }
        },
      },
      {
        Header: (
          <Box minWidth={100}>
            <FormattedMessage id="table.bar_code" />
          </Box>
        ),
        accessor: "bar_code",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.bar_code") || "-";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="text"
                value={value}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return <WrapperTableCell>{value}</WrapperTableCell>;
          }
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id="table.weight" />
          </Box>
        ),
        accessor: "weight",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow, setting } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.weight.weight");
          const unit = get(setting, "weight_unit");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={value}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: ` ${unit}`,
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value} suffix={` ${unit}`} />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.price`} />
          </Box>
        ),
        accessor: "price",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.price.excl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.price_incl_tax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value: string = get(row, "original.price.incl_tax") || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          }

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_EXTEND_UNIT_PRODUCT_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
            deleteHandler,
            activeEditRow,
            writePermission,
            activeEditRowHandler,
            removeEditRowDataHandler,
          } = props;

          const id = get(row, "original.id");

          if (writePermission) {
            return (
              <Stack flexDirection="row" alignItems="center" columnGap={1}>
                {activeEditRow[id] ? (
                  <Fragment>
                    <CheckButton
                      disabled={!!updateLoading[id]}
                      onClick={updateHandler([row])}
                    />

                    <CloseButton
                      disabled={!!updateLoading[id]}
                      onClick={removeEditRowDataHandler([row])}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <EditButton onClick={activeEditRowHandler(row)} />

                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler({
                          data: [row],
                        });
                      }}
                    />
                  </Fragment>
                )}
              </Stack>
            );
          }

          return null;
        },
        sticky: "right",
        width: 120,
        maxWidth: 120,
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
    useRowSelect,
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
    </WrapperTable>
  );
};

export default UnitTable;
