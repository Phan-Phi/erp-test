import { Stack, Box, Divider, Typography } from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import CardItem from "./CardItem";
import { FormatNumber } from "components";
import { GeneralNetRevenueReport } from "__generated__/apiType_v1";

interface OverviewProps {
  data: Required<GeneralNetRevenueReport>;
}

const Overview = ({ data }: OverviewProps) => {
  const {
    invoice_count,
    net_revenue_in_date,
    net_revenue_in_previous_date,
    net_revenue_in_date_of_previous_month,
  } = data;

  const compareToPreviousDate =
    (parseFloat(net_revenue_in_date.incl_tax as string) -
      parseFloat(net_revenue_in_previous_date.incl_tax as string)) /
    parseFloat(net_revenue_in_previous_date.incl_tax as string);

  const compareToPreviousMonth =
    (parseFloat(net_revenue_in_date.incl_tax as string) -
      parseFloat(net_revenue_in_date_of_previous_month.incl_tax as string)) /
    parseFloat(net_revenue_in_date_of_previous_month.incl_tax as string);

  return (
    <Box width="100%">
      <Typography fontWeight={700} marginBottom={3}>
        Kết quả bán hàng hôm nay
      </Typography>
      <Stack
        flexDirection="row"
        columnGap={2}
        divider={<Divider flexItem component="div" orientation="vertical" />}
      >
        <CardItem
          sx={{
            flex: "1 1 auto",
          }}
          Icon={CurrencyExchangeIcon}
          AvatarProps={{
            sx: {
              backgroundColor: "#1976D2",
            },
          }}
          SubMainProps={{
            children: `${invoice_count} hóa đơn`,
          }}
          MainProps={{
            children: <FormatNumber children={net_revenue_in_date.incl_tax} />,
          }}
          SubProps={{
            children: "Doanh thu",
          }}
        />

        <CardItem
          sx={{
            flex: "1 1 auto",
          }}
          Icon={compareToPreviousDate >= 0 ? ArrowUpwardIcon : ArrowDownwardIcon}
          AvatarProps={{
            sx: {
              backgroundColor: "#18c0c2",
            },
          }}
          SubMainProps={{
            children: (
              <Box
                component="span"
                sx={{
                  visibility: "hidden",
                }}
              >{`None`}</Box>
            ),
          }}
          MainProps={{
            children: isNaN(compareToPreviousDate) ? (
              "-"
            ) : (
              <FormatNumber
                children={(compareToPreviousDate * 100).toFixed(2)}
                suffix=" %"
              />
            ),
          }}
          SubProps={{
            children: "So với hôm qua",
          }}
        />
        <CardItem
          sx={{
            flex: "1 1 auto",
          }}
          Icon={compareToPreviousDate >= 0 ? ArrowUpwardIcon : ArrowDownwardIcon}
          AvatarProps={{
            sx: {
              backgroundColor: "#18c0c2",
            },
          }}
          SubMainProps={{
            children: (
              <Box
                component="span"
                sx={{
                  visibility: "hidden",
                }}
              >{`None`}</Box>
            ),
          }}
          MainProps={{
            children: isNaN(compareToPreviousMonth) ? (
              "-"
            ) : (
              <FormatNumber
                children={(compareToPreviousMonth * 100).toFixed(2)}
                suffix=" %"
              />
            ),
          }}
          SubProps={{
            children: "So với cùng kỳ tháng trước",
          }}
        />
      </Stack>
    </Box>
  );
};

export default Overview;
