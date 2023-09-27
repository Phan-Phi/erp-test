import useSWR from "swr";
import truncate from "lodash/truncate";

import { memo } from "react";
import { Stack, Typography, useTheme, Box } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import { useIntl } from "react-intl";
import { transformDate, transformUrl } from "libs";

import isEmpty from "lodash/isEmpty";

import {
  BarChart,
  CartesianGrid,
  NumberFormat,
  ResponsiveContainer,
  LoadingDynamic as Loading,
  NoData,
} from "components";

import {
  ADMIN_REPORTS_TOP_PRODUCT_BY_NET_REVENUE_END_POINT,
  ADMIN_REPORTS_TOP_PRODUCT_BY_PROFIT_END_POINT,
  ADMIN_REPORTS_TOP_PRODUCT_BY_QUANTITY_END_POINT,
  ADMIN_REPORTS_TOP_PRODUCT_BY_ROS_END_POINT,
} from "__generated__/END_POINT";
import {
  TopProductByNetRevenueReport,
  TopProductByProfitReport,
  TopProductByQuantityReport,
  TopProductByROSReport,
} from "__generated__/apiType_v1";

interface ProductReportByChartProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "warehouse_value" | "import_export_stock";
}

export const ProductReportByChart = (props: ProductReportByChartProps) => {
  const { viewType, filter } = props;

  const { data: topProductByNetRevenueData } = useSWR<TopProductByNetRevenueReport[]>(
    () => {
      if (viewType === "sale") {
        return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_NET_REVENUE_END_POINT, {
          get_all: true,
          date_start: transformDate(filter.range?.startDate, "date_start"),
          date_end: transformDate(filter.range?.endDate, "date_end"),
          name: filter.search,
          category: filter.category ? filter.category.id : undefined,
        });
      }
    }
  );

  const { data: topProductByQuantityData } = useSWR<TopProductByQuantityReport[]>(() => {
    if (viewType === "sale") {
      return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_QUANTITY_END_POINT, {
        get_all: true,
        date_start: transformDate(filter.range?.startDate, "date_start"),
        date_end: transformDate(filter.range?.endDate, "date_end"),
        name: filter.search,
        category: filter.category ? filter.category.id : undefined,
      });
    }
  });

  const { data: topProductByProfitData } = useSWR<TopProductByProfitReport[]>(() => {
    if (viewType === "profit") {
      return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_PROFIT_END_POINT, {
        get_all: true,
        date_start: transformDate(filter.range?.startDate, "date_start"),
        date_end: transformDate(filter.range?.endDate, "date_end"),
        name: filter.search,
        category: filter.category ? filter.category.id : undefined,
      });
    }
  });

  const { data: topProductByROSData } = useSWR<TopProductByROSReport[]>(() => {
    if (viewType === "profit") {
      return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_ROS_END_POINT, {
        get_all: true,
        date_start: transformDate(filter.range?.startDate, "date_start"),
        date_end: transformDate(filter.range?.endDate, "date_end"),
        name: filter.search,
        category: filter.category ? filter.category.id : undefined,
      });
    }
  });

  const theme = useTheme();
  const { messages } = useIntl();

  if (viewType === "sale") {
    if (
      topProductByNetRevenueData == undefined ||
      topProductByQuantityData == undefined
    ) {
      return <Loading />;
    }

    if (isEmpty(topProductByNetRevenueData) && isEmpty(topProductByQuantityData)) {
      return <NoData />;
    }

    const transformedTopProductByNetRevenue = topProductByNetRevenueData.map((el) => {
      return {
        ...el,
        net_revenue: parseFloat(el.net_revenue?.incl_tax || "0"),
      };
    });

    return (
      <Stack spacing={3}>
        <Box height={400}>
          <ResponsiveContainer>
            <BarChart
              data={transformedTopProductByNetRevenue}
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
        </Box>

        <Box height={400}>
          <ResponsiveContainer>
            <BarChart
              data={topProductByQuantityData}
              layout="vertical"
              margin={{
                top: 10,
                left: 50,
                right: 20,
              }}
            >
              <CartesianGrid />

              <XAxis
                dataKey={"quantity"}
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
                dataKey={"quantity"}
                fill={theme.palette.primary2.main}
                name={messages["quantity"] as string}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    );
  } else if (viewType === "profit") {
    if (topProductByProfitData == undefined || topProductByROSData == undefined) {
      return <Loading />;
    }

    if (isEmpty(topProductByProfitData) && isEmpty(topProductByROSData)) {
      return <NoData />;
    }

    const transformedTopProductByProfit = topProductByProfitData.map((el) => {
      return {
        ...el,
        profit: parseFloat(el.profit?.incl_tax || "0"),
      };
    });

    return (
      <Stack spacing={3}>
        {
          <Box height={400}>
            <ResponsiveContainer>
              <BarChart
                data={transformedTopProductByProfit}
                layout="vertical"
                margin={{
                  top: 10,
                  left: 50,
                  right: 20,
                }}
              >
                <CartesianGrid />

                <XAxis
                  dataKey={"profit"}
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
                  dataKey={"profit"}
                  fill={theme.palette.primary2.main}
                  name={messages["profit"] as string}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        }

        {
          <Box height={400}>
            <ResponsiveContainer>
              <BarChart
                data={topProductByROSData}
                layout="vertical"
                margin={{
                  top: 10,
                  left: 50,
                  right: 20,
                }}
              >
                <CartesianGrid />

                <XAxis
                  dataKey={"ros"}
                  type="number"
                  tickFormatter={(value) => {
                    const _value = new Intl.NumberFormat("en-US").format(value);

                    return (parseFloat(_value) * 100).toString();
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
                  dataKey={"ros"}
                  fill={theme.palette.primary2.main}
                  name={messages["ros"] as string}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        }
      </Stack>
    );
  } else {
    return <NoData />;
  }
};

const CustomTooltip = memo(
  ({ active, payload }: TooltipProps<string | number, string>) => {
    if (active && payload && payload.length) {
      const title = payload[0]?.name;
      let value = payload[0]?.value;
      const dataKey = payload[0]?.dataKey;
      const productName = payload[0]?.payload?.name;

      let suffix = "";

      if (dataKey === "ros") {
        suffix = "%";

        if (value && typeof value === "string") {
          value = parseFloat((parseFloat(value) * 100).toFixed(2));
        }
      } else if (dataKey === "profit") {
        suffix = " ₫";
      } else if (dataKey === "net_revenue") {
        suffix = " ₫";
      }

      return (
        <Stack spacing={1}>
          <Typography fontWeight={700}>{productName}</Typography>

          <Stack flexDirection="row" columnGap={1} alignItems="center">
            <Typography fontWeight={700}>{title}:</Typography>
            <NumberFormat value={value} suffix={suffix} />
          </Stack>
        </Stack>
      );
    }

    return null;
  }
);
