import useSWR from "swr";
import { format, parseISO } from "date-fns";
import { useUpdateEffect } from "react-use";
import React, { useState, useMemo } from "react";

import set from "lodash/set";

import { TableContainer } from "@mui/material";

import { REPORT_CASH } from "apis";
import { transformUrl } from "libs";
import { REPORT_CASH_ITEM } from "interfaces";
import { convertTimeToString, getPeriodUnitFromTimeObj } from "libs/dateUtils";

import { LoadingDynamic as Loading, NumberFormat } from "components";
import { Table, TableBody, TableCell, TableRow } from "components/TableV3";

const rows = [
  "Doanh thu bán hàng (1)",
  "Giảm trừ doanh thu (2)",
  "Doanh thu thuần (3 = 1 - 2)",
  "Giá vốn hàng bán (4)",
  "Lợi nhuận gộp về bán hàng (5 = 3 - 4)",
  "Chi phí (6)",
  "Lợi nhuận từ hoạt động kinh doanh (7 = 5 - 6)",
  "Thu nhập khác (8)",
  "Lợi nhuận thuần (9 = 7 + 8)",
];

interface SaleReportByTableProps {
  filter: Record<string, any>;
}

export const FinanceReportByTable = (props: SaleReportByTableProps) => {
  const { filter } = props;

  const [reload, setReload] = useState(false);

  const { data: cashData } = useSWR<REPORT_CASH_ITEM[]>(
    transformUrl(REPORT_CASH, {
      date_start: filter.date_start,
      date_end: filter.date_end,
      get_all: true,
      period: filter.period === "year" ? 12 : filter.period === "quarter" ? 3 : 1,
      period_unit: getPeriodUnitFromTimeObj({
        date_start: filter.date_start,
        date_end: filter.date_end,
      }),
    })
  );

  const transformedData = useMemo(() => {
    if (cashData == undefined) {
      return null;
    }

    const result: any[][] = [];

    rows.forEach((el, idx) => {
      // * Doanh thu bán hàng (1)

      if (idx === 0) {
        const columns: string[] = [];

        const data = cashData.map((el) => {
          if (filter.period === "month") {
            columns.push(format(parseISO(el.date_start), "MM/yyyy"));
          } else if (filter.period === "quarter") {
            columns.push(format(parseISO(el.date_start), "QQQ/yyyy"));
          } else {
            columns.push(convertTimeToString(filter.period, el.date_start));
          }

          return parseFloat(el.revenue.incl_tax);
        });

        result.push(["", ...columns]);

        result.push([el, ...data]);
      }

      // * Giảm trừ doanh thu (2)

      if (idx === 1) {
        const data = cashData.map((el) => {
          const netRevenue = parseFloat(el.net_revenue.incl_tax);
          const revenue = parseFloat(el.revenue.incl_tax);

          return revenue - netRevenue;
        });

        result.push([el, ...data]);
      }

      // * Doanh thu thuần (3 = 1 - 2),

      if (idx === 2) {
        const data = cashData.map((el) => {
          return parseFloat(el.net_revenue.incl_tax);
        });

        result.push([el, ...data]);
      }

      // * Giá vốn hàng bán (4)

      if (idx === 3) {
        const data = cashData.map((el) => {
          return parseFloat(el.base_amount.incl_tax);
        });

        result.push([el, ...data]);
      }

      // * Lợi nhuận gộp về bán hàng (5 = 3 - 4)

      if (idx === 4) {
        const data = cashData.map((el) => {
          const netRevenue = parseFloat(el.net_revenue.incl_tax);
          const baseAmount = parseFloat(el.base_amount.incl_tax);

          return netRevenue - baseAmount;
        });

        result.push([el, ...data]);
      }

      // * Chi phí (6)

      if (idx === 5) {
        const temp: any[] = [];
        const expensiveArr: any[] = [];

        cashData.forEach((el, columnIdx) => {
          let sum = 0;

          el.transaction_types.forEach((el, rowIdx) => {
            sum += parseFloat(el.expense.incl_tax);

            set(temp, `${rowIdx}.0`, el.name);
            set(temp, `${rowIdx}.${columnIdx + 1}`, parseFloat(el.expense.incl_tax));
          });

          expensiveArr.push(sum);
        });

        result.push([el, ...expensiveArr]);

        temp.forEach((el) => {
          result.push(el);
        });
      }

      // * Lợi nhuận từ hoạt động kinh doanh (7 = 5 - 6)

      if (idx === 6) {
        const temp: any[] = [];

        cashData.forEach((el) => {
          const netRevenue = parseFloat(el.net_revenue.incl_tax);
          const baseAmount = parseFloat(el.base_amount.incl_tax);

          let totalExpense = 0;

          el.transaction_types.forEach((el, rowIdx) => {
            totalExpense += parseFloat(el.expense.incl_tax);
          });

          temp.push(netRevenue - baseAmount - totalExpense);
        });

        result.push([el, ...temp]);
      }

      // * Thu nhập khác (8)

      if (idx === 7) {
        const temp: any[] = [];
        const revenueArr: any[] = [];

        cashData.forEach((el, columnIdx) => {
          let sum = 0;

          el.transaction_types.forEach((el, rowIdx) => {
            sum += parseFloat(el.revenue.incl_tax);

            set(temp, `${rowIdx}.0`, el.name);
            set(temp, `${rowIdx}.${columnIdx + 1}`, parseFloat(el.revenue.incl_tax));
          });

          revenueArr.push(sum);
        });

        result.push([el, ...revenueArr]);

        temp.forEach((el) => {
          result.push(el);
        });
      }

      // * Lợi nhuận thuần (9 = 7 + 8)

      if (idx === 8) {
        const temp: any[] = [];

        cashData.forEach((el) => {
          const netRevenue = parseFloat(el.net_revenue.incl_tax);
          const baseAmount = parseFloat(el.base_amount.incl_tax);

          let totalExpense = 0;
          let totalRevenue = 0;

          el.transaction_types.forEach((el, rowIdx) => {
            totalExpense += parseFloat(el.expense.incl_tax);
            totalRevenue += parseFloat(el.revenue.incl_tax);
          });

          temp.push(netRevenue + totalRevenue - baseAmount - totalExpense);
        });

        result.push([el, ...temp]);
      }
    });

    return result;
  }, [cashData, filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [filter.period]);

  if (reload) {
    return <Loading />;
  }

  if (transformedData == undefined) {
    return <Loading />;
  }

  return (
    <TableContainer>
      <Table size="medium">
        <TableBody>
          {transformedData.map((row, rowId) => {
            return (
              <TableRow key={rowId}>
                {row.map((el, columnId, arr) => {
                  return (
                    <TableCell
                      key={columnId}
                      sx={{
                        textAlign:
                          typeof el === "number" || rowId === 0 ? "right" : "left",
                        fontWeight:
                          arr[0].toString().includes("(") || rowId === 0 ? 700 : 400,
                        paddingLeft:
                          columnId === 0 && !el.toString().includes("(") ? 2.5 : 1,
                      }}
                    >
                      {typeof el === "string" ? (
                        el
                      ) : (
                        <NumberFormat value={Number.isInteger(el) ? el : el.toFixed(2)} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
