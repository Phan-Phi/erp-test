import { useIntl } from "react-intl";
import { useState, useCallback } from "react";
import {
  Stack,
  Button,
  MenuItem,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useChoice } from "hooks";
import {
  FilterByTimeRange,
  Select,
  LazyAutocomplete,
  SearchField,
  DateRangePicker,
  Radio,
  RadioItem,
} from "components";

import { LazyAutocomplete as LazyAutocompleteV2 } from "compositions";

import { CASH_TRANSACTION_TYPE, USER, CASH_PAYMENT_METHOD } from "apis";
import {
  CASH_PAYMENT_METHOD_ITEM,
  CASH_TRANSACTION_TYPE_ITEM,
  USER_ITEM,
} from "interfaces";

type FilterProps = {
  onFilterByTime: any;
  onDateRangeChange: any;
  onFilterDateHandler: any;
  onSearch: (value: string | undefined) => void;
  filter: any;
  filterDate: any;
  resetFilter: (value: any) => void;
};

const Filter = ({
  filter,
  filterDate,
  onFilterByTime,
  onDateRangeChange,
  onFilterDateHandler,
  onSearch,
  resetFilter,
}: FilterProps) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title={" Theo thời gian xác nhận"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <DateRangePicker
            ranges={[filterDate.range]}
            onChange={(ranges) => {
              const range = ranges.range;
              range && onFilterDateHandler && onFilterDateHandler(range);
            }}
            onFilterByTime={onFilterByTime}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={"Tìm kiếm"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <SearchField
            isShowIcon={false}
            initSearch={filter.search}
            onChange={(value) => {
              onSearch(value);
            }}
          />
        </CardContent>
      </Card>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
