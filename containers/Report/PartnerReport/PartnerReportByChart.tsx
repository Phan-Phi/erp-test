import useSWR from "swr";
import { memo } from "react";
import isEmpty from "lodash/isEmpty";
import { useIntl } from "react-intl";
import truncate from "lodash/truncate";
import { Stack, Typography, useTheme } from "@mui/material";
import { XAxis, YAxis, Tooltip, Legend, Bar, TooltipProps } from "recharts";

import {
  REPORT_TOP_PARTNER_BY_DEBT_AMOUNT,
  REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT,
} from "apis";
import {
  REPORT_TOP_PARTNER_BY_DEBT_AMOUNT_ITEM,
  REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT_ITEM,
} from "interfaces";

import { getPeriodFromTimeFrame } from "libs/dateUtils";

import {
  NoData,
  BarChart,
  NumberFormat,
  CartesianGrid,
  ResponsiveContainer,
  LoadingDynamic as Loading,
} from "components";
import { transformDate, transformUrl } from "libs";

interface PartnerReportByChartProps {
  filter: Record<string, any>;
  viewType: "import" | "debt";
}

export const PartnerReportByChart = (props: PartnerReportByChartProps) => {
  const { filter, viewType } = props;

  const theme = useTheme();

  const { messages } = useIntl();

  const { data: topPartnerByDebtAmountData } = useSWR<
    REPORT_TOP_PARTNER_BY_DEBT_AMOUNT_ITEM[]
  >(() => {
    if (viewType === "debt") {
      return transformUrl(REPORT_TOP_PARTNER_BY_DEBT_AMOUNT, {
        date_start: transformDate(filter.range.startDate, "date_start"),
        date_end: transformDate(filter.range.endDate, "date_end"),
        get_all: true,
        name: filter.search,
      });
    }
  });

  const { data: topPartnerByReceiptAmountData } = useSWR<
    REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT_ITEM[]
  >(() => {
    if (viewType === "import") {
      return transformUrl(REPORT_TOP_PARTNER_BY_RECEIPT_AMOUNT, {
        date_start: transformDate(filter.range.startDate, "date_start"),
        date_end: transformDate(filter.range.endDate, "date_end"),
        get_all: true,
        name: filter.search,
      });
    }
  });

  if (viewType === "import") {
    if (topPartnerByReceiptAmountData == undefined) {
      return <Loading />;
    }

    if (isEmpty(topPartnerByReceiptAmountData)) {
      return <NoData />;
    }

    const transformedData = topPartnerByReceiptAmountData.map((el) => {
      return {
        ...el,
        receipt_amount: parseFloat(el.receipt_amount.incl_tax),
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
            dataKey={"receipt_amount"}
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
            dataKey={"receipt_amount"}
            fill={theme.palette.primary2.main}
            name={messages["receiptAmount"] as string}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === "debt") {
    if (topPartnerByDebtAmountData == undefined) {
      return <Loading />;
    }

    if (isEmpty(topPartnerByDebtAmountData)) {
      return <NoData />;
    }

    const transformedData = topPartnerByDebtAmountData.map((el) => {
      return {
        ...el,
        debt_amount: parseFloat(el.debt_amount.incl_tax),
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
  }

  return null;
};

const CustomTooltip = memo(
  ({ active, payload }: TooltipProps<string | number, string>) => {
    if (active && payload && payload.length) {
      const title = payload[0]?.name;
      const value = payload[0]?.value;
      const partnerName = payload[0]?.payload?.name;

      return (
        <Stack spacing={1}>
          <Typography fontWeight={700}>{partnerName}</Typography>

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
