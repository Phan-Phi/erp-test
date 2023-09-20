import { FormattedMessage } from "react-intl";
import { PropsWithChildren } from "react";

import { Skeleton, Stack, IconButton } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";

import { CellProps, Column } from "react-table";
import {
  TableCellForSelection,
  TableCellWithFullAddress,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV2";
import { DeleteButton, ViewButton } from "components";
import { EDIT, WAREHOUSES } from "routes";

export const keys = ["selection", "warehouseName", "address", "action"];

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
      Header: <FormattedMessage id={`table.warehouseName`} />,
      accessor: "warehouseName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.address`} />,
      accessor: "address",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.primary_address.line1");

        const primaryAddress = get(row, "original.primary_address");

        const clonePrimaryAddress = cloneDeep(primaryAddress);

        set(clonePrimaryAddress, "address", value);

        return <TableCellWithFullAddress data={clonePrimaryAddress} loading={loading} />;
      },
      colSpan: 3,
      maxWidth: 500,
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row, writePermission, deleteHandler } = props;

        const isUsed = get(row, "original.is_used");

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" alignItems="center" columnGap={1}>
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
};

export default columns;
