import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import { DISCOUNTS, EDIT, ORDERS, PURCHASE_CHANNEL } from "routes";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import { formatDate } from "libs";
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
} from "components/TableV3";
import { CommonTableProps } from "interfaces";
import { ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type DiscountListTableProps = CommonTableProps<ADMIN_DISCOUNT_SALE_VIEW_TYPE_V1> &
  Record<string, any>;

export default function DiscountListColumnV2(props: DiscountListTableProps) {
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
    writePermission,
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
        Header: <FormattedMessage id={`table.discountName`} />,
        accessor: "discountName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 4,
      },

      {
        Header: <FormattedMessage id={`table.discount_amount`} />,
        accessor: "discount_amount",
        textAlign: "right",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const type = get(row, "original.discount_type");
          const value = get(row, "original.discount_amount");

          return (
            <WrapperTableCell textAlign="right" minWidth={80}>
              <NumberFormat
                value={parseFloat(value)}
                suffix={type === "Absolute" ? " ₫" : " %"}
              />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.period`} />,
        accessor: "period",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          let dateStart = get(row, "original.date_start");
          let dateEnd = get(row, "original.date_end");

          return (
            <WrapperTableCell>{`${formatDate(dateStart) || "-"} - ${
              formatDate(dateEnd) || "∞"
            }`}</WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${DISCOUNTS}/${EDIT}/${row.original.id}`} />

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
