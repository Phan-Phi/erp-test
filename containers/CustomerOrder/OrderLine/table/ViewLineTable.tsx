import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box } from "@mui/material";

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
} from "components/TableV3";
import { Link, NumberFormat, WrapperTable } from "components";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ViewLineTableProps = CommonTableProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1> &
  Record<string, any>;

const ViewLineTable = (props: ViewLineTableProps) => {
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
        Header: <FormattedMessage id={`table.variant_name`} />,
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
      },
      {
        Header: <FormattedMessage id={`table.variant_sku`} />,
        accessor: "variant_sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.variant_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.unit`} />,

        accessor: "unit",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.unit");

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
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
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
            <FormattedMessage id={`table.invoice_unit_quantity`} />
          </Box>
        ),
        accessor: "invoice_unit_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.invoice_unit_quantity") || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right" minWidth={150}>
            <FormattedMessage id={`table.delivered_unit_quantity`} />
          </Box>
        ),

        accessor: "delivered_unit_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.delivered_unit_quantity") || 0;

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
            <FormattedMessage id={`table.line_price`} />
          </Box>
        ),
        accessor: "line_price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_LINE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.line_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
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

export default ViewLineTable;
