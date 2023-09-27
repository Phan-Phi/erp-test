import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { Skeleton, Stack, IconButton } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { Link, NumberFormat } from "components";
import { useChoice } from "hooks";
import { WrapperTableCell } from "components/TableV3";

export const keys = [
  "transactionSId",
  "date_created",
  "transactionType",
  "flow_type",
  "target_name",
  "affect_creditor",
  "amount",
  "action",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.transactionSId`} />,
      accessor: "transactionSId",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.sid");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.date_created`} />,
      accessor: "date_created",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.date_created");

        return (
          <WrapperTableCell loading={loading}>
            {formatDate(value) || "-"}
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.status`} />,
      accessor: "status",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        const { transaction_statuses } = useChoice();

        const value = get(row, "original.status");
        const displayValue = getDisplayValueFromChoiceItem(transaction_statuses, value);

        return <WrapperTableCell loading={loading}>{displayValue}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.transactionType`} />,
      accessor: "transactionType",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.type.name");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.flow_type`} />,
      accessor: "flow_type",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        const { transaction_flow_types } = useChoice();

        const value = get(row, "original.flow_type");
        const displayValue = getDisplayValueFromChoiceItem(transaction_flow_types, value);

        return <WrapperTableCell loading={loading}>{displayValue}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.target_name`} />,
      accessor: "target_name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onGotoHandler } = props;

        const value = get(row, "original.target_name");

        return (
          <WrapperTableCell loading={loading}>
            {value ? (
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
            ) : (
              "-"
            )}
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.affect_creditor`} />,
      accessor: "affect_creditor",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.affect_creditor");

        let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

        return (
          <WrapperTableCell loading={loading} justifyContent="center">
            <CircleIcon
              sx={{
                color,
              }}
              fontSize="small"
            />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.amount`} />,
      accessor: "amount",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} justifyContent="flex-end">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, deleteHandler, approveHandler, writePermission, approvePermission } =
          props;

        if (loading) {
          return <Skeleton />;
        }

        const status = get(row, "original.status");

        if (writePermission && approvePermission) {
          if (status === "Confirmed") {
            return (
              <IconButton
                children={<CheckIcon />}
                sx={{
                  visibility: "hidden",
                }}
              />
            );
          } else {
            return (
              <Stack columnGap={1} flexDirection="row" alignItems="center">
                <IconButton
                  children={<CheckIcon />}
                  onClick={(e) => {
                    e.stopPropagation();

                    approveHandler({
                      data: [row],
                    });
                  }}
                />

                <IconButton
                  children={<DeleteIcon />}
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
        } else {
          return null;
        }
      },
    },
  ];
};

export default columns;
