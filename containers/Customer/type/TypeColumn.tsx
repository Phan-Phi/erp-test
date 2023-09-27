import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { Skeleton, Stack, Typography, Box } from "@mui/material";

import { DeleteButton, ViewButton } from "components";
import { CUSTOMERS, EDIT, TYPE } from "routes";
import {
  TableCellForSelection,
  TableHeaderForSelection,
  WrapperTableCell,
} from "components/TableV3";

export const keys = ["selection", "customerType", "action"];

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
      Header: <FormattedMessage id={`table.customerType`} />,
      accessor: "customerType",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const name = get(row, "original.name") || "-";
        const fullName = get(row, "original.full_name");
        const level = get(row, "original.level");

        return (
          <WrapperTableCell loading={loading}>
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
                {name}
              </Typography>
              <Typography variant="caption">{fullName}</Typography>
            </Box>
          </WrapperTableCell>
        );
      },
      colSpan: 3,
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row, writePermission, deleteHandler } = props;

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" alignItems="center" columnGap={1}>
            <ViewButton href={`/${CUSTOMERS}/${TYPE}/${EDIT}/${row.original.id}`} />

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
