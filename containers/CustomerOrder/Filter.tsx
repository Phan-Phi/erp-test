import { useIntl } from "react-intl";

import { get, isEmpty } from "lodash";
import { Stack, Button, Box, Typography, MenuItem } from "@mui/material";

import { LazyAutocomplete } from "compositions";
import { SearchField, Select, DateRangePicker } from "components";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { OrderListFilterType } from "./Order/OrderList";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
  ADMIN_ORDERS_SHIPPING_METHODS_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<OrderListFilterType> & {
  onSearchChange: any;
  onOwnerChange: (value: any) => void;
  onChannelChange: (value: any) => void;
  onStatusChange: (value: any) => void;
  onShippingMethodChange: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    onSearchChange,
    resetFilter,
    onDateRangeChange,
    onFilterByTime,
    onOwnerChange,
    onChannelChange,
    onStatusChange,
    onShippingMethodChange,
  } = props;

  const choice = useChoice();
  const { messages } = useIntl();
  const { order_statuses } = choice;

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <Typography fontWeight={700}>Tìm kiếm</Typography>

        <SearchField
          isShowIcon={false}
          initSearch={filter.search}
          onChange={onSearchChange}
          placeholder="Tìm kiếm"
        />
      </Stack>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["datePlaced"]}
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
          {messages["filterOwner"]}
        </Typography>

        <LazyAutocomplete<ADMIN_USER_USER_VIEW_TYPE_V1>
          {...{
            url: ADMIN_USERS_END_POINT,
            placeholder: messages["filterOwner"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                const fullName = `${get(option, "last_name")} ${get(
                  option,
                  "first_name"
                )}`;

                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={fullName}
                  />
                );
              },

              getOptionLabel: (option) => {
                const fullName = `${get(option, "last_name")} ${get(
                  option,
                  "first_name"
                )}`;

                return fullName;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              onChange: (e, value) => {
                onOwnerChange(value);
              },
              value: filter.owner,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterChannel"]}
        </Typography>

        <LazyAutocomplete<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1>
          {...{
            url: ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
            placeholder: messages["filterChannel"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    value={option.id}
                    key={option.id}
                    children={option.name}
                  />
                );
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              onChange: (e, value) => {
                onChannelChange(value);
              },
              value: filter.channel,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterOrderStatus"]}
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return order_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.status,
              onChange(event) {
                onStatusChange(event.target.value);
              },
              placeholder: messages["filterOrderStatus"] as string,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterShippingMethod"]}
        </Typography>

        <LazyAutocomplete<ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1>
          {...{
            url: ADMIN_ORDERS_SHIPPING_METHODS_END_POINT,
            placeholder: messages["filterShippingMethod"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              onChange: (e, value) => {
                onShippingMethodChange(value);
              },
              value: filter.shipping_method,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
