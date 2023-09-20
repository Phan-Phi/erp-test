import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

import { get } from "lodash";
import DynamicMessage from "messages";
import { Box, Stack, Typography } from "@mui/material";

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
  TableCellForAvatar,
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";
import { AddButton, Link, NumberFormat, WrapperTable } from "components";
import { ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CreateOrderedItemTableProps =
  CommonTableProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1> & Record<string, any>;

const CreateOrderedItemTable = (props: CreateOrderedItemTableProps) => {
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
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      // {
      //   Header: <FormattedMessage id={`table.variantSku`} />,
      //   accessor: "variantSku",
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;

      //     const value = get(row, "original.variant.sku");

      //     return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
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
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
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
          <Box textAlign="right">
            <FormattedMessage id={`table.price_incl_tax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PARTNER_PARTNER_ITEM_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value: string = get(row, "original.price.incl_tax") || "0";

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
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
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

export default CreateOrderedItemTable;
