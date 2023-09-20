import { get } from "lodash";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { Box, Stack, Typography } from "@mui/material";
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
  TableHeaderForSelection,
  TableCellForSelection,
} from "components/TableV3";
import { FormattedMessage } from "react-intl";
import { CUSTOMERS, EDIT, TYPE } from "routes";
import { DeleteButton, ViewButton } from "components";
import { CommonTableProps } from "interfaces";
import { ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type TypeListTableProps = CommonTableProps<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1> &
  Record<string, any>;

export default function TypeListTable(props: TypeListTableProps) {
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
    writePermission,
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
        Header: <FormattedMessage id={`table.customerType`} />,
        accessor: "customerType",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const name = get(row, "original.name") || "-";
          const fullName = get(row, "original.full_name");
          const level = get(row, "original.level");

          return (
            <WrapperTableCell>
              <Box
                sx={{
                  paddingLeft: (theme) => {
                    return theme.spacing(level);
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: level == 0 ? 700 : null,
                  }}
                >
                  {name}
                </Typography>
                <Typography variant="caption">{fullName}</Typography>
              </Box>
            </WrapperTableCell>
          );
        },
        colSpan: 3,
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${CUSTOMERS}/${TYPE}/${EDIT}/${row.original.id}`} />

              <DeleteButton
                disabled={!writePermission}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandler({
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
