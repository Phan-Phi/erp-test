import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { CellProps, Column } from "react-table";

import get from "lodash/get";

import { NumberFormat, Link } from "components";
import { WrapperTableCell } from "components/TableV3";

export const keys = ["partnerName", "beginningDebt", "credit", "debit", "endDebt"];

const columns = <T extends Record<string, unknown>>(loading?: boolean): Column<T>[] => {
  return [
    {
      Header: <FormattedMessage id={`table.partnerName`} />,
      accessor: "partnerName",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row, onViewDetailHandler } = props;

        const value = get(row, "original.name");

        return (
          <WrapperTableCell loading={loading}>
            <Link
              href="/"
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();

                onViewDetailHandler?.(row);
              }}
            >
              {value}
            </Link>
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.beginningDebt`} />,
      accessor: "beginningDebt",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.beginning_debt_amount.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.credit`} />,
      accessor: "credit",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.credit.incl_tax") || "0";

        return (
          <WrapperTableCell loading={loading} textAlign="center">
            <NumberFormat value={parseFloat(value)} />
          </WrapperTableCell>
        );
      },
    },
    {
      Header: <FormattedMessage id={`table.debit`} />,
      accessor: "debit",
      textAlign: "right",
      Cell: (props: PropsWithChildren<CellProps<T, any>>) => {
        const { row } = props;

        const value: string = get(row, "original.debit.incl_tax") || "0";

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

        const beginningDebtAmount: string =
          get(row, "original.beginning_debt_amount.incl_tax") || "0";

        const credit: string = get(row, "original.credit.incl_tax") || "0";
        const debit: string = get(row, "original.debit.incl_tax") || "0";

        const value = (
          parseFloat(beginningDebtAmount) +
          parseFloat(credit) -
          parseFloat(debit)
        ).toFixed(2);

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
