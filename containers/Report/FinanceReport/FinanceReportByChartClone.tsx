// import useSWR from "swr";
// import React, { memo } from "react";
// import { useIntl } from "react-intl";
// import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

// import isEmpty from "lodash/isEmpty";

// import { Stack, Typography, useTheme } from "@mui/material";

// import { REPORT_CASH } from "apis";
// import { transformUrl } from "libs";
// import { REPORT_CASH_ITEM } from "interfaces";
// import { convertTimeToString, getPeriodUnitFromTimeObj } from "libs/dateUtils";

// import {
//   BarChart,
//   CartesianGrid,
//   NoData,
//   NumberFormat,
//   ResponsiveContainer,
//   LoadingDynamic as Loading,
// } from "components";

// interface FinanceReportByChartProps {
//   filter: Record<string, any>;
// }

// export const FinanceReportByChartClone = (props: FinanceReportByChartProps) => {
//   const { filter } = props;

//   const { messages } = useIntl();

//   const theme = useTheme();

//   const { data: cashData } = useSWR<REPORT_CASH_ITEM[]>(
//     transformUrl(REPORT_CASH, {
//       date_start: filter.range.date_start,
//       date_end: filter.range.date_end,
//       get_all: true,
//       period: filter.period === "year" ? 12 : filter.range.period === "quarter" ? 3 : 1,
//       period_unit: getPeriodUnitFromTimeObj({
//         date_start: filter.range.date_start,
//         date_end: filter.range.date_end,
//       }),
//     })
//   );

//   if (cashData == undefined) {
//     return <Loading />;
//   }

//   if (isEmpty(cashData)) {
//     return <NoData />;
//   }

//   const transformedData = cashData.map((el) => {
//     return {
//       ...el,
//       date_start: convertTimeToString(filter.range.period, el.date_start),
//       profit: parseFloat(el.net_revenue.incl_tax) - parseFloat(el.base_amount.incl_tax),
//     };
//   });

//   return (
//     <ResponsiveContainer>
//       <BarChart
//         data={transformedData}
//         margin={{
//           top: 20,
//           left: 50,
//           right: 20,
//         }}
//       >
//         <CartesianGrid />

//         <XAxis dataKey="date_start" />
//         <YAxis
//           dataKey={"profit"}
//           tickFormatter={(value) => {
//             return new Intl.NumberFormat("en-US").format(value);
//           }}
//         />
//         <Tooltip content={<CustomTooltip />} />
//         <Legend />
//         <Bar
//           dataKey={"profit"}
//           fill={theme.palette.primary2.main}
//           name={messages["profit"] as string}
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//     const title = payload[0]?.name;
//     const value = payload[0]?.value;

//     return (
//       <Stack spacing={1}>
//         <Stack flexDirection="row" columnGap={1} alignItems="center">
//           <Typography fontWeight={700}>{title}:</Typography>
//           {value ? <NumberFormat value={parseFloat(value.toFixed(2))} /> : null}
//         </Stack>
//       </Stack>
//     );
//   }

//   return null;
// });

import useSWR from "swr";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import isEmpty from "lodash/isEmpty";

import { Stack, Typography, useTheme } from "@mui/material";

import { REPORT_CASH } from "apis";
import { transformUrl } from "libs";
import { REPORT_CASH_ITEM } from "interfaces";
import { convertTimeToString, getPeriodUnitFromTimeObj } from "libs/dateUtils";

import {
  BarChart,
  CartesianGrid,
  NoData,
  NumberFormat,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";

interface FinanceReportByChartProps {
  filter: Record<string, any>;
  data: any;
}

export const FinanceReportByChart = (props: FinanceReportByChartProps) => {
  const { filter, data: cashData } = props;

  const { messages } = useIntl();

  const theme = useTheme();

  // const { data: cashData } = useSWR<REPORT_CASH_ITEM[]>(
  //   transformUrl(REPORT_CASH, {
  //     date_start: filter.range.date_start,
  //     date_end: filter.range.date_end,
  //     get_all: true,
  //     period: filter.period === "year" ? 12 : filter.range.period === "quarter" ? 3 : 1,
  //     period_unit: getPeriodUnitFromTimeObj({
  //       date_start: filter.range.date_start,
  //       date_end: filter.range.date_end,
  //     }),
  //   })
  // );

  if (cashData == undefined || cashData.length === 0) {
    return <Loading />;
  }

  if (isEmpty(cashData)) {
    return <NoData />;
  }

  const transformedData = cashData.map((el) => {
    return {
      ...el,
      date_start: convertTimeToString(filter.period, el.date_start),
      profit: parseFloat(el.net_revenue.incl_tax) - parseFloat(el.base_amount.incl_tax),
    };
  });

  return (
    <ResponsiveContainer>
      <BarChart
        data={transformedData}
        margin={{
          top: 20,
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
