import useSWR from "swr";
import { memo } from "react";
import truncate from "lodash/truncate";
import { Stack, Typography, useTheme } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import isEmpty from "lodash/isEmpty";

import {
  NoData,
  BarChart,
  NumberFormat,
  CartesianGrid,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";

import { useIntl } from "react-intl";
import { transformDate, transformUrl } from "libs";
import { TopStaffByNetRevenueReport } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_TOP_STAFF_BY_NET_REVENUE_END_POINT } from "__generated__/END_POINT";

interface StaffReportByChartProps {
  filter: any;
  viewType: "sale" | "profit" | "hang_ban_theo_nhan_vien";
}

export const StaffReportByChart = (props: StaffReportByChartProps) => {
  const { viewType, filter } = props;

  const { messages } = useIntl();

  const theme = useTheme();

  const { data } = useSWR<TopStaffByNetRevenueReport[]>(
    transformUrl(ADMIN_REPORTS_TOP_STAFF_BY_NET_REVENUE_END_POINT, {
      date_start: transformDate(filter.range.startDate, "date_start"),
      date_end: transformDate(filter.range.endDate, "date_end"),
      get_all: true,
      name: filter.search,
      purchase_channel: filter.purchase_channel ? filter.purchase_channel.id : undefined,
    })
  );

  if (data == undefined) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <NoData />;
  }

  if (viewType === "sale") {
    const transformedData = data.map((el) => {
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
            name={messages["revenue"] as string}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === "profit") {
    return <NoData />;
  }

  return null;
};

const CustomTooltip = memo(
  ({ active, payload }: TooltipProps<string | number, string>) => {
    if (active && payload && payload.length) {
      const title = payload[0]?.name;
      const value = payload[0]?.value;

      const staffName = payload[0]?.payload?.name;

      return (
        <Stack spacing={1}>
          <Typography fontWeight={700}>{staffName}</Typography>

          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{title}:</Typography>
            <NumberFormat value={value} />
          </Stack>
        </Stack>
      );
    }

    return null;
  }
);
