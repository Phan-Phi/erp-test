import { get } from "lodash";
import { Box } from "@mui/material";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

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
import { FormattedMessage } from "react-intl";
import { Link, NumberFormat } from "components";

export default function ViewDetailLineTableItem(props: any) {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "",
        accessor: "primary_image",
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
          const { row } = props;

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
        colSpan: 3,
      },

      {
        Header: <FormattedMessage id={`table.sku`} />,
        accessor: "sku",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.line.variant_sku");
          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.unit_price_before_discounts`} />,
        accessor: "unit_price_before_discounts",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: string =
            get(row, "original.line.unit_price_before_discounts.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
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
            <WrapperTableCell textAlign="right" minWidth={120}>
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: number = get(row, "original.line.unit") || "-";

          return <WrapperTableCell minWidth={80}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.unit_quantity`} />,
        accessor: "unit_quantity",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: number = get(row, "original.unit_quantity") || 0;

          return (
            <WrapperTableCell textAlign="right" minWidth={60}>
              <NumberFormat value={value} suffix="" />
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
    useSortBy,
    useSticky
  );
  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
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
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
