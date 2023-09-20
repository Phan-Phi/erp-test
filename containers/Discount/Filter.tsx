import { Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { Button, Box, Typography, MenuItem } from "@mui/material";

import { LazyAutocomplete } from "compositions";
import { SearchField, DateRangePicker } from "components";

import { PRODUCT_CATEGORY, PARTNER } from "apis";

import { PRODUCT_CATEGORY_ITEM, PARTNER_ITEM, CommonFilterTableProps } from "interfaces";
import { ProductListFilterType } from "./DiscountList";

type FilterProps = CommonFilterTableProps<ProductListFilterType> & {
  onSearchChange: (value: any) => void;
  onOrderDateChange: any;
  onClickFilterOrderDate: any;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSearchChange,
    onDateRangeChange,
    onFilterByTime,
    onOrderDateChange,
    onClickFilterOrderDate,
  } = props;

  const { messages } = useIntl();

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["publicationDate"]}
        </Typography>

        <DateRangePicker
          ranges={[filter.range]}
          onChange={(ranges) => {
            const range = ranges.range;
            range && onDateRangeChange && onDateRangeChange(range);
          }}
          onFilterByTime={onFilterByTime}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["availableForPurchase"]}
        </Typography>

        <DateRangePicker
          ranges={[filter.order_date]}
          onChange={(ranges) => {
            const range = ranges.order_date;
            range && onOrderDateChange && onOrderDateChange(range);
          }}
          onFilterByTime={onClickFilterOrderDate}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
