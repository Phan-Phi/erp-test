import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";

import React, { Fragment, PropsWithChildren, useMemo } from "react";
import { CellProps, useTable } from "react-table";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import { CommonTableProps, WAREHOUSE_RECORD_ITEM } from "interfaces";

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

type ViewPurchaseOrderTableProps = CommonTableProps<any> & Record<string, any>;

const ViewPurchaseOrderTable = (props: ViewPurchaseOrderTableProps) => {
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
      // {
      //   accessor: "selection",
      //   Header: (props) => {
      //     const { getToggleAllRowsSelectedProps } = props;

      //     return (
      //       <TableHeaderForSelection
      //         getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
      //       />
      //     );
      //   },
      //   Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
      //     const { row } = props;
      //     return <TableCellForSelection loading={loading} row={row} />;
      //   },
      //   maxWidth: 64,
      //   width: 64,
      // },
      {
        accessor: "primary_image",
        Header: "",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
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
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
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
        Header: <FormattedMessage id={`table.variant_sku`} />,
        accessor: "variant_sku",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.quantity`} />
          </Box>
        ),
        accessor: "quantity",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.quantity") || 0;

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
            <FormattedMessage id={`table.receipt_quantity`} />
          </Box>
        ),
        accessor: "receipt_quantity",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.receipt_quantity") || 0;

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
            <FormattedMessage id={`table.return_quantity`} />
          </Box>
        ),
        accessor: "return_quantity",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.return_quantity") || 0;

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
            <FormattedMessage id={`table.actually_receipt_quantity`} />
          </Box>
        ),
        accessor: "actually_receipt_quantity",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const receiptQuantity = get(row, "original.receipt_quantity");
          const returnQuantity = get(row, "original.return_quantity");

          const value = receiptQuantity - returnQuantity;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.line_price`} />
          </Box>
        ),
        accessor: "line_price",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.line_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix=" ₫" />
            </WrapperTableCell>
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

export default ViewPurchaseOrderTable;
