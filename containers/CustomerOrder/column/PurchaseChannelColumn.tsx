import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { Skeleton, Stack } from "@mui/material";

import { DeleteButton, ViewButton } from "components";
import { EDIT, ORDERS, PURCHASE_CHANNEL } from "routes";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = ["selection", "purchaseChannelName", "action"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
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
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        return <TableCellForSelection loading={loading} row={row} />;
      },
      maxWidth: 64,
      width: 64,
    },
    {
      Header: <FormattedMessage id={`table.purchaseChannelName`} />,
      accessor: "purchaseChannelName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
      colSpan: 4,
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row, writePermission, deleteHandler } = props;

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" alignItems="center" columnGap={1}>
            <ViewButton
              href={`/${ORDERS}/${PURCHASE_CHANNEL}/${EDIT}/${row.original.id}`}
            />
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
};

export default columns;
