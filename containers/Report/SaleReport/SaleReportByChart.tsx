import useSWR from "swr";
import { memo } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import {
  BarChart,
  NoData,
  NumberFormat,
  CartesianGrid,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";

import {
  convertTimeToString,
  getDifferenceInDays,
  getUnitFromTimeFrame,
  getPeriodFromTimeObj,
  getPeriodUnitFromTimeObj,
} from "libs/dateUtils";

import { useIntl } from "react-intl";
import { transformDate, transformUrl } from "libs";
import { RevenueReport } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_REVENUE_END_POINT } from "__generated__/END_POINT";

import isEmpty from "lodash/isEmpty";

interface SaleReportByChartProps {
  filter: any;
  viewType: "time" | "profit" | "discount";
}

/* eslint react/display-name: off */

export const SaleReportByChart = (props: SaleReportByChartProps) => {
  const { filter, viewType } = props;

  const theme = useTheme();
  const { messages } = useIntl();

  const { data } = useSWR<RevenueReport[]>(() => {
    return transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, {
      date_start: transformDate(filter.range?.startDate, "date_start"),
      date_end: transformDate(filter.range?.endDate, "date_end"),
      get_all: true,
      period: getPeriodFromTimeObj({
        date_start: transformDate(filter.range?.startDate, "date_start"),
        date_end: transformDate(filter.range?.endDate, "date_end"),
      }),
      period_unit: getPeriodUnitFromTimeObj({
        date_start: transformDate(filter.range?.startDate, "date_start"),
        date_end: transformDate(filter.range?.endDate, "date_end"),
      }),
      purchase_channel: filter.purchase_channel
        ? filter.purchase_channel.purchase_channel
        : undefined,
    });
  });

  if (data == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <NoData />;
  }

  if (viewType === "time") {
    const transformedData = data.map((el) => {
      let date_start = "";
      let date_end = "";

      if (filter.timeFrame) {
        date_start = convertTimeToString(
          getUnitFromTimeFrame(filter.timeFrame),
          el.date_start
        );

        date_end = convertTimeToString(
          getUnitFromTimeFrame(filter.timeFrame),
          el.date_end
        );
      } else {
        const distance = getDifferenceInDays({
          date_end: filter.range.date_end,
          date_start: filter.range.date_start,
        });

        if (distance > 31) {
          date_start = convertTimeToString("month", el.date_start);
          date_end = convertTimeToString("month", el.date_end);
        } else {
          date_start = convertTimeToString("day", el.date_start);
          date_end = convertTimeToString("day", el.date_end);
        }
      }

      const net_revenue = parseFloat(el.net_revenue?.incl_tax as any);

      return {
        date_start,
        date_end,
        net_revenue,
      };
    });

    return (
      <ResponsiveContainer>
        <BarChart data={transformedData}>
          <CartesianGrid />
          <XAxis dataKey="date_start" />

          <YAxis
            dataKey={"net_revenue"}
            tickFormatter={(value) => {
              return new Intl.NumberFormat("en-US").format(value);
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar
            dataKey={"net_revenue"}
            name={messages["netRevenue"] as string}
            fill={theme.palette.primary2.main}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === "profit") {
    const transformedData = data.map((el) => {
      let date_start = "";
      let date_end = "";

      if (filter.timeFrame) {
        date_start = convertTimeToString(
          getUnitFromTimeFrame(filter.timeFrame),
          el.date_start
        );

        date_end = convertTimeToString(
          getUnitFromTimeFrame(filter.timeFrame),
          el.date_end
        );
      } else {
        const distance = getDifferenceInDays({
          date_end: filter.date_end,
          date_start: filter.date_start,
        });

        if (distance > 31) {
          date_start = convertTimeToString("month", el.date_start);
          date_end = convertTimeToString("month", el.date_end);
        } else {
          date_start = convertTimeToString("day", el.date_start);
          date_end = convertTimeToString("day", el.date_end);
        }
      }

      const net_revenue = parseFloat(el.net_revenue?.incl_tax as any);
      const base_amount = parseFloat(el.base_amount?.incl_tax as any);
      const profit = net_revenue - base_amount;

      return {
        date_start,
        date_end,
        net_revenue,
        base_amount,
        profit,
      };
    });

    return (
      <ResponsiveContainer>
        <BarChart data={transformedData}>
          <CartesianGrid />
          <XAxis dataKey="date_start" />

          <YAxis
            dataKey={"net_revenue"}
            tickFormatter={(value) => {
              return new Intl.NumberFormat("en-US").format(value);
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Bar
            dataKey={"profit"}
            name={messages["profit"] as string}
            fill={theme.palette.primary2.main}
          />

          <Bar
            dataKey={"net_revenue"}
            name={messages["revenue"] as string}
            fill={theme.palette.success.main}
          />
          <Bar
            dataKey={"base_amount"}
            name={messages["baseAmount"] as string}
            fill={theme.palette.warning.main}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === "discount") {
    return <NoData />;
  }

  return null;
};

const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const profit = payload[0]?.name;
    const profitValue = payload[0]?.value;

    const net_revenue = payload[1]?.name;
    const netRevenueValue = payload[1]?.value;

    const baseAmount = payload[2]?.name;
    const baseAmountValue = payload[2]?.value;

    return (
      <Stack spacing={1}>
        {profitValue && profit ? (
          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{profit}:</Typography>

            <NumberFormat value={parseFloat(profitValue.toFixed(2))} />
          </Stack>
        ) : null}

        {netRevenueValue && net_revenue ? (
          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{net_revenue}:</Typography>
            <NumberFormat value={parseFloat(netRevenueValue.toFixed(2))} />
          </Stack>
        ) : null}

        {baseAmount && baseAmountValue ? (
          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{baseAmount}:</Typography>
            <NumberFormat value={parseFloat(baseAmountValue.toFixed(2))} />
          </Stack>
        ) : null}
      </Stack>
    );
  }

  return null;
});
