import useSWR from "swr";
import { omit } from "lodash";
import { Typography, Box, Stack } from "@mui/material";

import { transformUrl } from "libs";
import { useIntl } from "react-intl";
import { CASH, CASH_TRANSACTION_TYPE, CASH_PAYMENT_METHOD } from "apis";
import { FailToLoad, FormatNumber, LoadingDynamic as Loading } from "components";

const Total = ({ params }) => {
  const { messages } = useIntl();

  const { data: cashData, error: cashError } = useSWR(() => {
    const { type, payment_method, range } = params;

    if (type) {
      return transformUrl(`${CASH_TRANSACTION_TYPE}${type}`, {
        date_start: range.startDate,
        date_end: range.endDate,
      });
    }

    if (payment_method) {
      return transformUrl(`${CASH_PAYMENT_METHOD}${payment_method}`, {
        date_start: range.startDate,
        date_end: range.endDate,
      });
    }

    return transformUrl(CASH, {
      ...omit(params, ["range", "range_params", "sid_icontains"]),
    });
  });

  if (cashError) return <FailToLoad />;

  if (cashData == undefined) return <Loading />;

  return (
    <Stack
      columnGap={3}
      flexDirection="row"
      justifyContent="flex-end"
      sx={{
        padding: 2,
        backgroundColor: (theme) => {
          return theme.palette.grey[100];
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["beginningBalance"]}
        </Typography>
        <Typography
          sx={{
            color: "info.main",
          }}
        >
          <FormatNumber children={cashData.beginning_balance.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalRevenue"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "primary.main",
          }}
        >
          <FormatNumber children={cashData.total_revenue.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalExpense"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "error.main",
          }}
        >
          <FormatNumber children={cashData.total_expense.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalBalance"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "success.main",
          }}
        >
          <FormatNumber children={cashData.total_balance.incl_tax} />
        </Typography>
      </Box>
    </Stack>
  );
};

export default Total;
