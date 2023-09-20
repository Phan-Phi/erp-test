import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { Fragment, PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

import { get } from "lodash";
import { Box, Stack, MenuItem, Typography } from "@mui/material";

import { useChoice } from "hooks";
import DynamicMessage from "messages";
import { getDisplayValueFromChoiceItem } from "libs";
import { ChoiceItem, CommonTableProps } from "interfaces";

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
  NumberFormat,
  WrapperTable,
  CheckButton,
  CloseButton,
  DeleteButton,
  EditButton,
  LoadingButton,
} from "components";
import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type OrderItemTableProps =
  CommonTableProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1> & Record<string, any>;

const OrderItemTable = (props: OrderItemTableProps) => {
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
        Header: "Mã hàng",
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.variant_name");

          return (
            <WrapperTableCell title={value}>
              <Link
                href="#"
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
        maxWidth: 400,
      },
      // {
      //   Header: <FormattedMessage id={`table.partner_sku`} />,
      //   accessor: "partner_sku",
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;

      //     const value = get(row, "original.partner_sku");

      //     return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      //   },
      // },
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
          const { cell, row, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.quantity") || 0;

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
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={value} suffix="" />
              </WrapperTableCell>
            );
          }
        },
        minWidth: 120,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.discount_amount`} />
          </Box>
        ),
        accessor: "discount_amount",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { cell, row, updateEditRowDataHandler, activeEditRow, editData } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value: string = get(row, "original.discount_amount") || "0";

          if (activeEditRow[id]) {
            const discountType =
              get(editData, `current.${id}.discount_type`) ||
              get(row, "original.discount_type");

            return (
              <TableCellForEdit
                inputType="number"
                value={
                  get(editData, `current.${id}.discount_amount`) || parseFloat(value)
                }
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: discountType === "Percentage" ? " %" : " ₫",
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

          const discountType = get(row, "original.discount_type");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat
                value={parseFloat(value)}
                suffix={discountType === "Percentage" ? " %" : " ₫"}
              />
            </WrapperTableCell>
          );
        },
        minWidth: 150,
      },
      {
        Header: <FormattedMessage id={`table.discount_type`} />,
        accessor: "discount_type",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            cell,
            row,
            updateEditRowDataHandler,
            activeEditRow,
            activeEditRowHandler,
          } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.discount_type") || "";

          const { discount_types } = useChoice();

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="select"
                value={value}
                onChange={(value) => {
                  activeEditRowHandler(row)();

                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
                renderItem={() => {
                  return discount_types.map((el: ChoiceItem) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell>
                {getDisplayValueFromChoiceItem(discount_types, value)}
              </WrapperTableCell>
            );
          }
        },
        maxWidth: 200,
        minWidth: 200,
      },
      {
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.variant.unit") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.unit_price_incl_tax`} />
          </Box>
        ),
        accessor: "unit_price_incl_tax",
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
        minWidth: 150,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.line_price_incl_tax`} />
          </Box>
        ),
        accessor: "line_price_incl_tax",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.line_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
        minWidth: 150,
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
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
        maxWidth: 180,
        width: 180,
        sticky: "right",
      },
    ];
  }, []);
  const { formatMessage, messages } = useIntl();

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

export default OrderItemTable;
