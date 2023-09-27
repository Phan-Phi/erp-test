import { useState } from "react";
import { Stack, Button, Card, CardHeader, CardContent, MenuItem } from "@mui/material";

import { useIntl } from "react-intl";
import { ORDER_PURCHASE_CHANNEL } from "apis";
import { LazyAutocomplete } from "compositions";
import { SearchField, DateRangePicker } from "components";
import { ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type FilterProps = {
  onFilterByTime: any;
  onDateRangeChange: any;
  onFilterDateHandler: any;
  onSearch: (value: string | undefined) => void;
  filter: any;
  filterDate: any;
  resetFilter: (value: any) => void;
  onCategoryChange: any;
};

const Filter = ({
  filter,
  filterDate,
  onFilterByTime,
  onDateRangeChange,
  onFilterDateHandler,
  onSearch,
  resetFilter,
  onCategoryChange,
}: FilterProps) => {
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title={"Kênh bán"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <LazyAutocomplete<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1>
            {...{
              url: ORDER_PURCHASE_CHANNEL,
              placeholder: "Kênh bán",
              AutocompleteProps: {
                renderOption(props, option) {
                  return <MenuItem {...props} value={option.id} children={option.name} />;
                },
                getOptionLabel: (option) => {
                  return filter.purchase_channel
                    ? filter.purchase_channel.name
                    : option.name;
                },
                onChange: (_, value) => {
                  onCategoryChange(value);
                },
                value: filter.purchase_channel,
              },
              initValue: null,
            }}
          />
        </CardContent>
      </Card>

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
