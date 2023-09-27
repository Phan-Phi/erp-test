import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import DynamicMessage from "messages";
import { Box, Stack, Typography } from "@mui/material";

import { CommonTableProps } from "interfaces";
import { ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

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

import { NumberFormat, WrapperTable, LoadingButton, AddButton } from "components";

type AddProductTableProps = CommonTableProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1> &
  Record<string, any>;

const AddProductTable = (props: AddProductTableProps) => {
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
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(row, "original.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.editable_sku`} />,
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.default_variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 400,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.price_incl_tax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const hasVariant = get(row, "original.product_class.has_variants");

          if (hasVariant) {
            const minPrice = get(row, "original.min_variant_price.incl_tax") || "0";
            const maxPrice = get(row, "original.max_variant_price.incl_tax") || "0";

            return (
              <WrapperTableCell textAlign="right" columnGap={2}>
                <NumberFormat value={parseFloat(minPrice)} />

                <Typography component="span">-</Typography>

                <NumberFormat value={parseFloat(maxPrice)} />
              </WrapperTableCell>
            );
          } else {
            const price = get(row, "original.default_variant.price.incl_tax") || "0";

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(price)} />
              </WrapperTableCell>
            );
          }
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          return (
            <AddButton
              disabled={!!addLoading[id]}
              onClick={() => {
                addHandler?.({ data: [row] });
              }}
            />
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

export default AddProductTable;
