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
  CheckButton,
  CloseButton,
  DeleteButton,
  EditButton,
  Link,
  NumberFormat,
  WrapperTable,
} from "components";
import { ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type AddedItemTableProps = CommonTableProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1> &
  Record<string, any>;

const AddedItemTable = (props: AddedItemTableProps) => {
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
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
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
        accessor: "variant.editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      // {
      //   Header: <FormattedMessage id="table.partner_sku" />,
      //   accessor: "partner_sku",
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

      //     const id = get(row, "original.id");
      //     const columnId = get(cell, "column.id");
      //     const value = get(row, "original.partner_sku");

      //     if (activeEditRow[id]) {
      //       return (
      //         <TableCellForEdit
      //           inputType="text"
      //           value={value}
      //           onChange={(value) => {
      //             updateEditRowDataHandler?.({
      //               value,
      //               row,
      //               keyName: columnId,
      //             });
      //           }}
      //         />
      //       );
      //     } else {
      //       return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      //     }
      //   },
      // },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
          >
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
            <FormattedMessage id={`table.inputPrice`} />
          </Box>
        ),
        accessor: "price",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, cell, updateEditRowDataHandler, activeEditRow } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value: string = get(row, "original.price.excl_tax") || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
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
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.inputPriceInclTax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
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
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
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

export default AddedItemTable;
