import { CellProps, Column } from "react-table";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import get from "lodash/get";

import { Skeleton, Stack } from "@mui/material";

import { DeleteButton, NumberFormat, ViewButton } from "components";

import { useChoice } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";
import { EDIT, ORDERS, SHIPPING_METHOD } from "routes";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = [
  "selection",
  "shippingMethodName",
  "shippingMethodType",
  "price",
  "action",
];

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
      Header: <FormattedMessage id={`table.shippingMethodName`} />,
      accessor: "shippingMethodName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
      colSpan: 3,
    },
    {
      Header: <FormattedMessage id={`table.shippingMethodType`} />,
      accessor: "shippingMethodType",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const { shipping_method_types } = useChoice();
        const value = get(row, "original.type");
        const displayValue = getDisplayValueFromChoiceItem(shipping_method_types, value);

        return <WrapperTableCell loading={loading}>{displayValue}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.price`} />,
      accessor: "price",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.price.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="right">
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

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <ViewButton
              href={`/${ORDERS}/${SHIPPING_METHOD}/${EDIT}/${row.original.id}`}
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
// `/${ORDERS}/${SHIPPING_METHOD}/${EDIT}/${row.original.id}`
