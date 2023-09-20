import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";

import React, { Fragment, PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

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
  TableCellForAvatar,
} from "components/TableV3";
import {
  Link,
  CheckButton,
  CloseButton,
  DeleteButton,
  EditButton,
  NumberFormat,
  WrapperTable,
} from "components";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type LineTableProps = CommonTableProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1> &
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
        Header: "Mã hàng",
        accessor: "variant.editable_sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box>
            <FormattedMessage id={`table.variant_name`} />
          </Box>
        ),
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
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
        colSpan: 3,
      },
      {
        Header: (
          <Box minWidth={100}>
            <FormattedMessage id={`table.unit`} />
          </Box>
        ),
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 3,
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
          const { row, cell, editData, activeEditRow, updateEditRowDataHandler } = props;
          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const unitQuantity = get(row, "original.unit_quantity");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "number",
                  value: get(editData, `current.${id}.${columnId}`) || unitQuantity,
                  NumberFormatProps: {
                    allowNegative: false,
                    suffix: "",
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
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={unitQuantity} suffix="" />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.unit_price_before_discounts`} />
          </Box>
        ),
        accessor: "unit_price_before_discounts",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string =
            get(row, "original.unit_price_before_discounts.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.unit_price`} />
          </Box>
        ),
        accessor: "unit_price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.unit_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.line_price`} />
          </Box>
        ),
        accessor: "line_price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.line_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
            deleteHandler,
            activeEditRow,
            activeEditRowHandler,
            removeEditRowDataHandler,
            writePermission,
          } = props;

          const id = get(row, "original.id");

          if (writePermission) {
            return (
              <Stack columnGap={1} flexDirection="row" alignItems="center">
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
                )}
              </Stack>
            );
          }

          return null;
        },
        maxWidth: 120,
        width: 120,
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

export default LineTable;
