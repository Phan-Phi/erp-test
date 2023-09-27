import useSWR from "swr";
import { useIntl } from "react-intl";
import { XAxis, YAxis, Legend, Tooltip, Bar } from "recharts";
import { Fragment, useMemo, useState, useCallback } from "react";

import { get, isEmpty } from "lodash";
import { Stack, Typography, Tab, Tabs, useTheme, Box } from "@mui/material";

import {
  Card,
  NoData,
  BarChart,
  TabPanel,
  FormatNumber,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as CustomTooltip,
  LoadingDynamic as Loading,
} from "components";
import TimeFrameFilter from "./TimeFrameFilter";

import {
  convertChartNum,
  convertTimeFrame,
  convertUnitToPeriodTime,
  convertWeekOfDays,
  convertTimeToString,
  ConvertTimeFrameType,
  ConvertPeriodTimeType,
} from "libs/dateUtils";
import { transformUrl } from "libs";

import { NetRevenueReport } from "__generated__/apiType_v1";
import { ADMIN_REPORTS_NET_REVENUE_END_POINT } from "__generated__/END_POINT";

const NetRevenue = () => {
  const theme = useTheme();
  const { messages } = useIntl();

  const [sumRevenue, setSumRevenue] = useState(0);

  const [currentTab, setCurrentTab] = useState<ConvertPeriodTimeType>("day");
  const [timeFrame, setTimeFrame] = useState<ConvertTimeFrameType>("this_month");

  const { data: netRevenueData } = useSWR<NetRevenueReport[]>(() => {
    let params = {
      ...convertTimeFrame(timeFrame),
      period: convertUnitToPeriodTime(currentTab),
      chart_num: convertChartNum(timeFrame, currentTab),
    };

    // set(
    //   params,
    //   "period_unit",
    //   getPeriodUnitFromTimeObj({
    //     date_start: params.date_start,
    //     date_end: params.date_end,
    //   })
    // );

    return transformUrl(ADMIN_REPORTS_NET_REVENUE_END_POINT, params);
  });

  const changeTabHandler = useCallback((_, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const timeFrameHandler = useCallback((value) => {
    setTimeFrame(value);
  }, []);

  const renderChart = useMemo(() => {
    if (netRevenueData == undefined) return <Loading />;

    let sum = 0;

    let transformedData = netRevenueData.map((el) => {
      const date_start = convertTimeToString(currentTab, get(el, "dates.[0].date_start"));
      const date_end = convertTimeToString(currentTab, get(el, "dates.[0].date_end"));

      const net_revenue = parseFloat(get(el, "net_revenue.incl_tax") || "0");

      sum += net_revenue;

      return {
        date_start,
        date_end,
        net_revenue,
      };
    });

    setSumRevenue(sum);

    if (currentTab === "week") {
      const tempList = [];

      transformedData.forEach((el) => {
        const order = el.date_start;

        tempList[order] = el;
      });

      transformedData = tempList.filter((el) => {
        return el != undefined;
      });
    }

    if (isEmpty(transformedData)) return <NoData />;

    return (
      <Fragment>
        <TabPanel value={currentTab} index={"day"}>
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
                name={messages["revenue"] as string}
                fill={theme.palette.primary2.main}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel value={currentTab} index={"hour"}>
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
                name={messages["revenue"] as string}
                fill={theme.palette.primary2.main}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>
        <TabPanel value={currentTab} index={"week"}>
          <ResponsiveContainer>
            <BarChart data={transformedData}>
              <CartesianGrid />
              <XAxis
                dataKey="date_start"
                tickFormatter={(value, index) => {
                  const data = convertWeekOfDays(value);

                  if (data) {
                    const { id } = data;

                    return messages[id] as string;
                  } else {
                    return value;
                  }
                }}
              />
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
                name={messages["revenue"] as string}
                fill={theme.palette.primary2.main}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>
      </Fragment>
    );
  }, [netRevenueData, currentTab]);

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Stack
              flexDirection={"row"}
              columnGap={2}
              justifyContent="center"
              alignItems="center"
            >
              <Typography>{"Doanh thu thuần"}</Typography>

              <Typography variant="h6">
                <FormatNumber children={parseFloat(sumRevenue.toFixed(2))} />
              </Typography>
            </Stack>

            <Box
              sx={{
                alignSelf: "flex-start",
              }}
            >
              <TimeFrameFilter onChange={timeFrameHandler} />
            </Box>
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <Fragment>
            <Tabs
              value={currentTab}
              onChange={changeTabHandler}
              sx={{
                marginBottom: 2,
              }}
            >
              <Tab label="Theo ngày" value="day" />
              <Tab label="Theo giờ" value="hour" />
              <Tab label="Theo thứ" value="week" />
            </Tabs>

            <Box minHeight={400}>{renderChart}</Box>
          </Fragment>
        );
      }}
    />
  );
};

export default NetRevenue;
