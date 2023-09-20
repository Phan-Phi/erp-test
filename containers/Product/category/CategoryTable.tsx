import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, Stack, Typography } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";
import { DeleteButton, LoadingButton, ViewButton } from "components";

import DynamicMessage from "messages";
import { CommonTableProps } from "interfaces";
import { CATEGORY, EDIT, PRODUCTS } from "routes";
import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CategoryTableProps = CommonTableProps<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1> &
  Record<string, any>;

const CategoryTable = (props: CategoryTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    deleteHandler,
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
        Header: <FormattedMessage id={`table.categoryName`} />,
        accessor: "categoryName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");
          const level = get(row, "original.level");
          const fullName = get(row, "original.full_name");

          if (value) {
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
                    {value}
                  </Typography>
                  <Typography variant="caption">{fullName}</Typography>
                </Box>
              </WrapperTableCell>
            );
          } else {
            return <WrapperTableCell>{"-"}</WrapperTableCell>;
          }
        },
        colSpan: 4,
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${PRODUCTS}/${CATEGORY}/${EDIT}/${row.original.id}`} />

              {writePermission && (
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

  const { formatMessage, messages } = useIntl();

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
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
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
    </Box>
  );
};

export default CategoryTable;
