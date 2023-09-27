import useSWR from "swr";
import { memo } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import isEmpty from "lodash/isEmpty";

import { REPORT_CASH } from "apis";
import { transformUrl } from "libs";
import { useIntl } from "react-intl";
import { CashBookReport } from "__generated__/apiType_v1";
import { convertTimeToString, getPeriodUnitFromTimeObj } from "libs/dateUtils";

import {
  NoData,
  BarChart,
  NumberFormat,
  CartesianGrid,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";

interface FinanceReportByChartProps {
  filter: Record<string, any>;
}

export const FinanceReportByChart = (props: FinanceReportByChartProps) => {
  const { filter } = props;

  const { messages } = useIntl();

  const theme = useTheme();

  const { data: cashData } = useSWR<CashBookReport[]>(
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

  if (cashData == undefined) {
    return <Loading />;
  }

  if (isEmpty(cashData)) {
    return <NoData />;
  }

  const transformedData = cashData.map((el) => {
    return {
      ...el,
      date_start: convertTimeToString(filter.period, el.date_start),
      profit:
        parseFloat(el.net_revenue?.incl_tax as any) -
        parseFloat(el.base_amount?.incl_tax as any),
    };
  });

  return (
    <ResponsiveContainer>
      <BarChart
        data={transformedData}
        margin={{
          top: 10,
          left: 50,
          right: 20,
        }}
      >
        <CartesianGrid />

        <XAxis dataKey="date_start" />
        <YAxis
          dataKey={"profit"}
          tickFormatter={(value) => {
            return new Intl.NumberFormat("en-US").format(value);
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey={"profit"}
          fill={theme.palette.primary2.main}
          name={messages["profit"] as string}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const title = payload[0]?.name;
    const value = payload[0]?.value;

    return (
      <Stack spacing={1}>
        <Stack flexDirection="row" columnGap={1} alignItems="center">
          <Typography fontWeight={700}>{title}:</Typography>
          {value ? <NumberFormat value={parseFloat(value.toFixed(2))} /> : null}
        </Stack>
      </Stack>
    );
  }

  return null;
});
