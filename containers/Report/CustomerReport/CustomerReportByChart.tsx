import useSWR from "swr";
import { memo } from "react";
import truncate from "lodash/truncate";
import { Stack, Typography, useTheme } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import {
  BarChart,
  CartesianGrid,
  NoData,
  NumberFormat,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";

import isEmpty from "lodash/isEmpty";

import { useIntl } from "react-intl";
import { transformDate, transformUrl } from "libs";

import {
  ADMIN_REPORTS_TOP_CUSTOMER_BY_DEBT_AMOUNT_END_POINT,
  ADMIN_REPORTS_TOP_CUSTOMER_BY_NET_REVENUE_END_POINT,
} from "__generated__/END_POINT";

import {
  TopCustomerByDebtAmountReport,
  TopCustomerByNetRevenueReport,
} from "__generated__/apiType_v1";

interface CustomerReportByChartProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "debt";
}

export const CustomerReportByChart = (props: CustomerReportByChartProps) => {
  const { filter, viewType } = props;

  const { messages } = useIntl();

  const theme = useTheme();

  const { data: topCustomerByNetRevenueData } = useSWR<TopCustomerByNetRevenueReport[]>(
    () => {
      if (viewType === "sale") {
        return transformUrl(ADMIN_REPORTS_TOP_CUSTOMER_BY_NET_REVENUE_END_POINT, {
          date_start: transformDate(filter.range.startDate, "date_start"),
          date_end: transformDate(filter.range.endDate, "date_end"),
          get_all: true,
          name: filter.search,
        });
      }
    }
  );

  const { data: topCustomerByDebtAmountData } = useSWR<TopCustomerByDebtAmountReport[]>(
    () => {
      if (viewType === "debt") {
        return transformUrl(ADMIN_REPORTS_TOP_CUSTOMER_BY_DEBT_AMOUNT_END_POINT, {
          date_start: transformDate(filter.range.startDate, "date_start"),
          date_end: transformDate(filter.range.endDate, "date_end"),
          get_all: true,
          name: filter.search,
        });
      }
    }
  );

  if (viewType === "debt") {
    if (topCustomerByDebtAmountData == undefined) {
      return <Loading />;
    }

    if (isEmpty(topCustomerByDebtAmountData)) {
      return <NoData />;
    }

    const transformedData = topCustomerByDebtAmountData.map((el) => {
      return {
        ...el,
        debt_amount: parseFloat(el.debt_amount?.incl_tax as never),
      };
    });

    return (
      <ResponsiveContainer>
        <BarChart
          data={transformedData}
          layout="vertical"
          margin={{
            top: 10,
            left: 50,
            right: 20,
          }}
        >
          <CartesianGrid />

          <XAxis
            dataKey={"debt_amount"}
            type="number"
            tickFormatter={(value) => {
              return new Intl.NumberFormat("en-US").format(value);
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            orientation="left"
            width={150}
            tickFormatter={(value) => {
              return truncate(value, {
                length: 15,
                separator: " ",
              });
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={"debt_amount"}
            fill={theme.palette.primary2.main}
            name={messages["debtAmount"] as string}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === "profit") {
    return <NoData />;
  } else if (viewType === "sale") {
    if (topCustomerByNetRevenueData == undefined) {
      return <Loading />;
    }

    if (isEmpty(topCustomerByNetRevenueData)) {
      return <NoData />;
    }

    const transformedData = topCustomerByNetRevenueData.map((el) => {
      return {
        ...el,
        net_revenue: parseFloat(el.net_revenue?.incl_tax as never),
      };
    });

    return (
      <ResponsiveContainer>
        <BarChart
          data={transformedData}
          layout="vertical"
          margin={{
            top: 10,
            left: 50,
            right: 20,
          }}
        >
          <CartesianGrid />

          <XAxis
            dataKey={"net_revenue"}
            type="number"
            tickFormatter={(value) => {
              return new Intl.NumberFormat("en-US").format(value);
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            orientation="left"
            width={150}
            tickFormatter={(value) => {
              return truncate(value, {
                length: 15,
                separator: " ",
              });
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey={"net_revenue"}
            fill={theme.palette.primary2.main}
            name={messages["netRevenue"] as string}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const title = payload[0]?.name;
    const value = payload[0]?.value;

    const customerName = payload[0]?.payload?.name;

    if (value) {
      return (
        <Stack spacing={1}>
          <Typography fontWeight={700}> {customerName}</Typography>

          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{title}:</Typography>
            <NumberFormat value={parseFloat(value.toFixed(2))} />
          </Stack>
        </Stack>
      );
    }
    return null;
  }
  return null;
});
