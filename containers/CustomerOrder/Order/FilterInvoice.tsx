import React from "react";

import { isEmpty } from "lodash";
import { Box, MenuItem, Stack, Typography } from "@mui/material";

import { LazyAutocomplete } from "compositions";
import { ButtonReset, DateRangePicker, SearchField, Select } from "components";

import { useChoice } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { InvoiceListFilterType } from "./InvoiceList";

import { ADMIN_ORDERS_SHIPPERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<InvoiceListFilterType> & {
  onSearchChange: any;
  onStatusChange: (value: any) => void;
  onShippingStatusChange: (value: any) => void;
  onShipperChange: (value: any) => void;
};

export default function FilterInvoice(props: FilterProps) {
  const {
    onSearchChange,
    filter,
    resetFilter,
    onStatusChange,
    onShippingStatusChange,
    onShipperChange,
    onDateRangeChange,
    onFilterByTime,
  } = props;

  const choice = useChoice();
  const { invoice_statuses, shipping_statuses } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
        placeholder="Tìm kiếm"
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Trạng thái hóa đơn
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return invoice_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.status,
              onChange(event) {
                onStatusChange(event.target.value);
              },
              placeholder: "Trạng thái hóa đơn",
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Trạng thái giao hàng
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return shipping_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.shipping_status,
              onChange(event) {
                onShippingStatusChange(event.target.value);
              },
              placeholder: "Trạng thái giao hàng",
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Người giao hàng
        </Typography>

        <LazyAutocomplete<ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1>
          url={ADMIN_ORDERS_SHIPPERS_END_POINT}
          placeholder="Người giao hàng"
          AutocompleteProps={{
            value: filter.shipper,
            onChange: (_, value) => {
              onShipperChange(value);
            },

            renderOption: (props, option) => {
              return (
                <MenuItem
                  {...props}
                  key={option.id}
                  value={option?.id}
                  children={option.name}
                />
              );
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
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Ngày tạo
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

      <ButtonReset onClick={resetFilter} />
    </Stack>
  );
}
