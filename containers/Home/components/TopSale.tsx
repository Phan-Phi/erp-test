import useSWR from "swr";
import { useIntl } from "react-intl";
import { useMemo, useState, useCallback, memo } from "react";
import { Bar, Legend, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

import { isEmpty, truncate } from "lodash";
import { Box, Stack, Typography, useTheme } from "@mui/material";

import {
  Card,
  NoData,
  BarChart,
  NumberFormat,
  CartesianGrid,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";
import TimeFrameFilter from "./TimeFrameFilter";
import SelectTypeOfTopSale from "./SelectTypeOfTopSale";

import { transformUrl } from "libs";
import { convertTimeFrame, ConvertTimeFrameType } from "libs/dateUtils";

import {
  ADMIN_REPORTS_TOP_PRODUCT_BY_NET_REVENUE_END_POINT,
  ADMIN_REPORTS_TOP_PRODUCT_BY_QUANTITY_END_POINT,
} from "__generated__/END_POINT";

import {
  TopProductByNetRevenueReport,
  TopProductByQuantityReport,
} from "__generated__/apiType_v1";

const NetRevenue = () => {
  const theme = useTheme();
  const { messages } = useIntl();
  const [type, setType] = useState("by_revenue");
  const [timeFrame, setTimeFrame] = useState<ConvertTimeFrameType>("this_month");

  const { data: resData } = useSWR<
    Required<TopProductByNetRevenueReport>[] | TopProductByQuantityReport[]
  >(() => {
    let params = {
      ...convertTimeFrame(timeFrame),
    };

    if (type === "by_revenue") {
      return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_NET_REVENUE_END_POINT, params);
    } else if (type === "by_quantity") {
      return transformUrl(ADMIN_REPORTS_TOP_PRODUCT_BY_QUANTITY_END_POINT, params);
    } else {
      return null;
    }
  });

  const timeFrameHandler = useCallback((value) => {
    setTimeFrame(value);
  }, []);

  const selectTypeHandler = useCallback((value) => {
    setType(value);
  }, []);

  const renderChart = useMemo(() => {
    if (resData === undefined) {
      return <Loading />;
    }

    let transformedData: any[] = [];

    if (type === "by_revenue") {
      const _data = resData as Required<TopProductByNetRevenueReport>[];

      transformedData = _data?.map((el) => {
        return {
          ...el,
          net_revenue: parseFloat(el.net_revenue.incl_tax || "0"),
        };
      });
    } else if (type === "by_quantity") {
      transformedData = resData;
    }

    if (isEmpty(transformedData)) {
      return <NoData />;
    }

    return (
      <Box minHeight={400}>
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
              dataKey={type === "by_revenue" ? "net_revenue" : "quantity"}
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
              dataKey={type === "by_revenue" ? "net_revenue" : "quantity"}
              fill={theme.palette.primary2.main}
              name={
                type === "by_revenue"
                  ? (messages["revenue"] as string)
                  : (messages["quantity"] as string)
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }, [resData, type]);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              columnGap={2}
            >
              <Typography>{"Top 10 hàng hóa bán chạy"}</Typography>
              <SelectTypeOfTopSale onChange={selectTypeHandler} />
            </Stack>
            <TimeFrameFilter onChange={timeFrameHandler} />
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return <Box minHeight={400}>{renderChart}</Box>;
      }}
    />
  );
};

const CustomTooltip = memo(
  ({ active, payload }: TooltipProps<string | number, string>) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const dataKey = payload[0].dataKey;
      const name = payload[0]?.payload?.name;
      const unit = payload[0]?.payload?.unit;

      return (
        <Box textAlign={"center"}>
          <Typography variant="h6">
            {name} - {unit}
          </Typography>
          <NumberFormat
            value={value}
            {...(dataKey === "quantity" && {
              suffix: "",
            })}
          />
        </Box>
      );
    }

    return null;
  }
);

export default NetRevenue;
