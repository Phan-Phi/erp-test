import { Stack, Button, Typography, Box } from "@mui/material";
import { useState, useCallback } from "react";

import { useIntl } from "react-intl";

import { SearchField, FilterByTimeRange } from "components";

type FilterProps = {
  onFilterHandler: (key: any) => (value: any) => void;
  data?: Record<string, string>;
  reset: () => void;
};

const Filter = ({ onFilterHandler, data, reset }: FilterProps) => {
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  const resetStateHandler = useCallback(() => {
    reset();

    setIsReady(false);

    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, [reset]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={data?.["search"]}
        onChange={onFilterHandler("search")}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterByTime"]}
        </Typography>

        <FilterByTimeRange
          onChangeDateStart={onFilterHandler("date_start")}
          onChangeDateEnd={onFilterHandler("date_end")}
          initDateStart={data?.date_start || null}
          initDateEnd={data?.date_end || null}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["discountAmount"]}
        </Typography>

        <FilterByTimeRange
          onChangeDateStart={onFilterHandler("discount_amount_start")}
          onChangeDateEnd={onFilterHandler("discount_amount_end")}
          initDateStart={data?.discount_amount_start || null}
          initDateEnd={data?.discount_amount_end || null}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetStateHandler}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
