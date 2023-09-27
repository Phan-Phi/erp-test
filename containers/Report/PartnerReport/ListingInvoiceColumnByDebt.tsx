import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { useChoice } from "hooks";
import { NumberFormat } from "components";
import { WrapperTableCell } from "components/TableV3";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";

export const keys = ["sid", "time", "transactionType", "debt_amount", "endDebt"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.sid`} />,
      accessor: "sid",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.source.sid");

        return <WrapperTableCell loading={loading}>{value}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.time`} />,
      accessor: "time",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value = get(row, "original.date_created");

        return <WrapperTableCell loading={loading}>{formatDate(value)}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.transactionType`} />,
      accessor: "transactionType",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;
        const { permission_content_types } = useChoice();
        const value = get(row, "original.source_type");

        const displayValue = getDisplayValueFromChoiceItem(
          permission_content_types,
          value
        );

        return <WrapperTableCell loading={loading}>{displayValue}</WrapperTableCell>;
      },
    },
    {
      Header: <FormattedMessage id={`table.debt_amount`} />,
      accessor: "debt_amount",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.debt_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.endDebt`} />,
      accessor: "endDebt",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string =
          get(row, "original.total_debt_amount_at_time.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
  ];
};

export default columns;
