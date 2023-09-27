import get from "lodash/get";
import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { Skeleton, Stack } from "@mui/material";
import { CellProps, Column } from "react-table";

import { formatDate } from "libs";

import { DeleteButton, NumberFormat, ViewButton } from "components";

import { DISCOUNTS, EDIT } from "routes";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = ["selection", "discountName", "discount_amount", "period", "action"];

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
      Header: <FormattedMessage id={`table.discountName`} />,
      accessor: "discountName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.discount_amount`} />,
      accessor: "discount_amount",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const type = get(row, "original.discount_type");
        const value = get(row, "original.discount_amount");

        return (
          <WrapperTableCell loading={loading} textAlign="right">
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
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        let dateStart = get(row, "original.date_start");
        let dateEnd = get(row, "original.date_end");

        return (
          <WrapperTableCell loading={loading}>{`${formatDate(dateStart) || "-"} - ${
            formatDate(dateEnd) || "∞"
          }`}</WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row, deleteHandler, writePermission } = props;

        if (loading) return <Skeleton />;

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
};

export default columns;
