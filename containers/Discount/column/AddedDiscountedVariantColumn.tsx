import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";
import { Skeleton, Stack } from "@mui/material";

import get from "lodash/get";

import { DeleteButton, Link } from "components";
import {
  TableCellForAvatar,
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = [
  "selection",
  "primary_image",
  "productName",
  "productClassName",
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
      accessor: "primary_image",
      Header: "",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const image = get(row, "original.variant.primary_image.product_small");

        return <TableCellForAvatar src={image} loading={loading} />;
      },
      maxWidth: 90,
      width: 90,
    },
    {
      Header: <FormattedMessage id={`table.productName`} />,
      accessor: "productName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onGotoHandler } = props;

        const value = get(row, "original.variant.name");

        return (
          <WrapperTableCell loading={loading}>
            <Link
              href={"#"}
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();

                onGotoHandler?.(row);
              }}
            >
              {value}
            </Link>
          </WrapperTableCell>
        );
      },
      colSpan: 2,
    },
    {
      Header: <FormattedMessage id={`table.productClassName`} />,
      accessor: "productClassName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.variant.product.product_class.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, deleteHandler, writePermission } = props;

        if (loading) return <Skeleton />;

        if (writePermission) {
          return (
            <Stack columnGap={1} flexDirection="row" alignItems="center">
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();

                  deleteHandler({
                    data: [row],
                  });
                }}
              />
            </Stack>
          );
        }

        return null;
      },
      maxWidth: 120,
      minWidth: 120,
      sticky: "right",
    },
  ];
};

export default columns;
