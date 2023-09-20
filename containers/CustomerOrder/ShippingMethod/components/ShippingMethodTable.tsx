import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps, useRowSelect } from "react-table";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellForSelection,
  TableContainer,
  TableHead,
  TableHeaderForSelection,
  TablePagination,
  WrapperTableCell,
  WrapperTableHeaderCell,
} from "components/TableV3";
import { useChoice } from "hooks";
import { CommonTableProps } from "interfaces";
import { getDisplayValueFromChoiceItem } from "libs";
import { EDIT, ORDERS, SHIPPING_METHOD } from "routes";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import { ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ShippingMethodTableProps =
  CommonTableProps<ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1> & Record<string, any>;

export default function ShippingMethodTable(props: ShippingMethodTableProps) {
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
        Header: <FormattedMessage id={`table.shippingMethodName`} />,
        accessor: "shippingMethodName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell minWidth={170}>{value}</WrapperTableCell>;
        },
        colSpan: 3,
      },

      {
        Header: <FormattedMessage id={`table.shippingMethodType`} />,
        accessor: "shippingMethodType",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const { shipping_method_types } = useChoice();
          const value = get(row, "original.type");
          const displayValue = getDisplayValueFromChoiceItem(
            shipping_method_types,
            value
          );

          return (
            <WrapperTableHeaderCell minWidth={190}>{displayValue}</WrapperTableHeaderCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.price`} />,
        accessor: "price",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value: string = get(row, "original.price.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right" minWidth={60}>
              <NumberFormat value={value && parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, deleteHandler } = props;

          // if (loading) return <Skeleton />;

          return (
            <Stack flexDirection="row" columnGap={1} alignItems="center">
              <ViewButton
                href={`/${ORDERS}/${SHIPPING_METHOD}/${EDIT}/${row.original.id}`}
              />
              {writePermission && (
                <DeleteButton
                  disabled={!writePermission}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
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
  return (
    <Box>
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
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
