import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";

import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { cloneDeep, get, set } from "lodash";
import { Box, Icon, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

import { useChoice } from "hooks";
import { formatDate, formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";
import { CUSTOMER_DRAFT_ITEM, CommonTableProps, PARTNER_ITEM } from "interfaces";

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
  TableCellWithFullAddress,
  WrapperTableHeaderCell,
} from "components/TableV3";
import {
  Link,
  CheckButton,
  DeleteButton,
  NumberFormat,
  ViewButton,
  AddLinkButton,
} from "components";
import { EDIT, ORDERS, PARTNERS, PURCHASE_CHANNEL } from "routes";
import { ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type PurchaseChannelTableProps =
  CommonTableProps<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1> & Record<string, any>;

const PurchaseChannelColumnV2 = (props: PurchaseChannelTableProps) => {
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
        accessor: "selection",
        Header: (props) => {
          const { getToggleAllRowsSelectedProps } = props;

          return (
            <TableHeaderForSelection
              getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
            />
          );
        },
        Cell: (props: PropsWithChildren<CellProps<PARTNER_ITEM, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },
      {
        Header: <FormattedMessage id={`table.purchaseChannelName`} />,
        accessor: "purchaseChannelName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
        colSpan: 4,
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, deleteHandler } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton
                href={`/${ORDERS}/${PURCHASE_CHANNEL}/${EDIT}/${row.original.id}`}
              />

              {writePermission && (
                <DeleteButton
                  onClick={(e) => {
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

export default PurchaseChannelColumnV2;
