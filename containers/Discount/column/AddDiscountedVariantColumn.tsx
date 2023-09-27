import { FormattedMessage } from "react-intl";

import get from "lodash/get";

import { CellProps, Column } from "react-table";
import { PropsWithChildren } from "react";

import { Link } from "components";
import {
  TableCellForAvatar,
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = ["selection", "primary_image", "productName"];

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

        const image = get(row, "original.primary_image.product_small");

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

        const value = get(row, "original.name");

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
      colSpan: 3,
    },
  ];
};

export default columns;
