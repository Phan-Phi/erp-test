import { useState } from "react";
import { Stack, Button, MenuItem, Card, CardHeader, CardContent } from "@mui/material";

import isEmpty from "lodash/isEmpty";

import { useIntl } from "react-intl";
import { DateRangePicker } from "components";
import { LazyAutocomplete } from "compositions";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT } from "__generated__/END_POINT";

type FilterProps = {
  onFilterByTime: any;
  onDateRangeChange: any;
  onFilterDateHandler: any;
  filterDate: any;
  onPurchaseChannelChange: any;
  resetFilter: (value: any) => void;
  filter: any;
};

const Filter = ({
  filter,
  filterDate,
  onFilterByTime,
  onFilterDateHandler,
  resetFilter,
  onPurchaseChannelChange,
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
          <LazyAutocomplete<any>
            {...{
              url: ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
              placeholder: messages["filterChannel"] as string,
              AutocompleteProps: {
                renderOption(props, option) {
                  return <MenuItem {...props} value={option.id} children={option.name} />;
                },

                getOptionLabel: (option) => {
                  return filter.purchase_channel ? option.name : "";
                },
                isOptionEqualToValue: (option, value) => {
                  if (isEmpty(option) || isEmpty(value)) {
                    return true;
                  }

                  return option?.["id"] === value?.["id"];
                },

                onChange: (e, value) => {
                  onPurchaseChannelChange({
                    purchase_channel: value?.id ? `${value?.id}` : undefined,
                  });
                },
              },
              params: {
                nested_depth: 1,
              },
              initValue: null,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={"Theo thời gian xác nhận"} />
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

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
