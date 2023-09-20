import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import FacebookIcon from "@mui/icons-material/Facebook";

import { useChoice } from "hooks";
import { DETAIL, USERS } from "routes";
import { WrapperTableCell } from "components/TableV2";
import { Link, Skeleton, ViewButton } from "components";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";

export const keys = [
  "id",
  "username",
  "last_name",
  "first_name",
  "gender",
  "birthday",
  "email",
  "is_active",
  "is_staff",
  "facebook",
  "date_joined",
];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.id`} />,
      accessor: "id",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.id");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.username`} />,
      accessor: "username",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.username") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.last_name`} />,
      accessor: "last_name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.last_name") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.first_name`} />,
      accessor: "first_name",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.first_name") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.gender`} />,
      accessor: "gender",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        const { genders } = useChoice();

        const value = get(row, `original.gender`);
        const displayValue = getDisplayValueFromChoiceItem(genders, value);

        return (
          <WrapperTableCell loading={loading}>
            {displayValue ? displayValue : "-"}
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.birthday`} />,
      accessor: "birthday",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.birthday");

        return (
          <WrapperTableCell loading={loading}>
            {formatDate(value, "dd/MM/yyyy") || "-"}
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.email`} />,
      accessor: "email",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.email") || "-";

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.is_active`} />,
      accessor: "is_active",
      textAlign: "center",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.is_active");

        let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <CircleIcon
              sx={{
                color,
              }}
            />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.is_staff`} />,
      accessor: "is_staff",
      textAlign: "center",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.is_staff");

        let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <CircleIcon
              sx={{
                color,
              }}
            />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.facebook`} />,
      accessor: "facebook",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.facebook");

        return (
          <WrapperTableCell loading={loading}>
            {value ? <Link href={value} children={<FacebookIcon />} /> : "-"}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: <FormattedMessage id={`table.date_joined`} />,
      accessor: "date_joined",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.date_joined");

        return (
          <WrapperTableCell loading={loading}>
            {formatDate(value, "dd/MM/yyyy")}
          </WrapperTableCell>
        );
      },
    },

    {
      Header: <FormattedMessage id={`table.action`} />,
      accessor: "action",
      Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
        const { row } = props;

        if (loading) return <Skeleton />;

        return (
          <Stack flexDirection="row" alignItems="center" columnGap={1}>
            <ViewButton href={`/${USERS}/${DETAIL}/${row.original.id}`} />
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
