import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { cloneDeep, get, set } from "lodash";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableCellForSelection,
  TableCellWithFullAddress,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
  TableHeaderForSelection,
} from "components/TableV3";
import { EDIT, WAREHOUSES } from "routes";
import { CommonTableProps } from "interfaces";
import { DeleteButton, ViewButton } from "components";
import { ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type WarehouseTableProps = CommonTableProps<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1> &
  Record<string, any>;

export default function WarehouseTable(props: WarehouseTableProps) {
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
    deleteHandler,
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
        Header: <FormattedMessage id={`table.warehouseName`} />,
        accessor: "warehouseName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.address`} />,
        accessor: "address",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.primary_address.line1");

          const primaryAddress = get(row, "original.primary_address");

          const clonePrimaryAddress = cloneDeep(primaryAddress);

          set(clonePrimaryAddress, "address", value);

          if (clonePrimaryAddress == undefined || clonePrimaryAddress == null) {
            return <WrapperTableCell></WrapperTableCell>;
          }
          return <TableCellWithFullAddress data={clonePrimaryAddress} />;
        },
        colSpan: 3,
        maxWidth: 500,
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission } = props;

          const isUsed = get(row, "original.is_used");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} minWidth={70}>
              <ViewButton href={`/${WAREHOUSES}/${EDIT}/${row.original.id}`} />

              {writePermission && !isUsed && (
                <DeleteButton
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
