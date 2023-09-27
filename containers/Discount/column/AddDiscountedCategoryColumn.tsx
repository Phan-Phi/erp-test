import get from "lodash/get";

import { FormattedMessage } from "react-intl";

import { CellProps, Column } from "react-table";

import { PropsWithChildren } from "react";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = ["selection", "categoryName"];

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
      Header: <FormattedMessage id={`table.categoryName`} />,
      accessor: "categoryName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
      colSpan: 3,
    },
  ];
};

export default columns;
