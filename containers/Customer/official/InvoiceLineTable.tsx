import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable } from "react-table";
import React, { PropsWithChildren, useMemo } from "react";

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
import { NumberFormat, WrapperTable, Link } from "components";

type InvoiceLineTableProps = CommonTableProps<any> & Record<string, any>;

const InvoiceLineTable = (props: InvoiceLineTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        accessor: "primary_image",
        Header: "",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const image = get(row, "original.line.variant.primary_image.product_small");

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

          const value = get(row, "original.line.variant_name");

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
        colSpan: 2,
      },
      {
        Header: <FormattedMessage id={`table.quantity`} />,
        accessor: "quantity",
        textAlign: "right",
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
        Header: <FormattedMessage id={`table.unit_price`} />,
        accessor: "unit_price",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: string = get(row, "original.line.unit_price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.amount`} />,
        accessor: "amount",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: string = get(row, "original.amount.incl_tax") || "0";

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
    useSticky
  );

  return (
    <Box marginBottom="20px">
      <WrapperTable>
        <TableContainer maxHeight={maxHeight}>
          <Table>
            <TableHead>
              <RenderHeader table={table} />
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
    </Box>
  );
};

export default InvoiceLineTable;
