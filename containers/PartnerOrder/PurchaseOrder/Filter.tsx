import { useIntl } from "react-intl";

import { isEmpty, get } from "lodash";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { useChoice } from "hooks";
import { LazyAutocomplete } from "compositions";
import { CommonFilterTableProps } from "interfaces";
import { PurchaseOrderListFilterType } from "./PurchaseOrderList";
import { SearchField, Select, DateRangePicker, FilterByPriceRangeV2 } from "components";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_WAREHOUSES_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
  ADMIN_PARTNERS_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<PurchaseOrderListFilterType> & {
  onSearchChange: any;
  onPriceStart: any;
  onPriceEnd: any;
  onClickFilterPrice: any;
  onOwnerChange: (value: any) => void;
  onStatusChange: (value: any) => void;
  onWarehouseChange: (value: any) => void;
  onVariantNameChange: (value: any) => void;
  onPartnerChange: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSearchChange,
    onFilterByTime,
    onDateRangeChange,
    onPriceStart,
    onPriceEnd,
    onClickFilterPrice,
    onOwnerChange,
    onStatusChange,
    onWarehouseChange,
    onVariantNameChange,
    onPartnerChange,
  } = props;

  const choice = useChoice();
  const { messages } = useIntl();
  const { purchase_order_statuses } = choice;

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
          {messages["totalPrice"]}
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.total_start}
          initPriceEnd={filter.total_end}
          onChangePriceStart={onPriceStart}
          onChangePriceEnd={onPriceEnd}
          onFilterPrice={onClickFilterPrice}
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
            shouldSearch: false,
            AutocompleteProps: {
              renderOption(props, option) {
                const lastName = get(option, "last_name");
                const firstName = get(option, "first_name");

                const fullName = `${lastName} ${firstName}`;

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
                const lastName = get(option, "last_name");
                const firstName = get(option, "first_name");

                const fullName = `${lastName} ${firstName}`;

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
              is_staff: true,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterStatus"]}
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return purchase_order_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.status,
              onChange(event) {
                onStatusChange(event.target.value);
              },
              placeholder: messages["filterStatus"] as string,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterWarehouse"]}
        </Typography>

        <LazyAutocomplete<ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_WAREHOUSES_END_POINT,
            placeholder: messages["filterWarehouse"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
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
                onWarehouseChange(value);
              },
              value: filter.warehouse,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterProduct"]}
        </Typography>

        <LazyAutocomplete<Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>>
          {...{
            url: ADMIN_PRODUCTS_VARIANTS_END_POINT,
            placeholder: messages["filterProduct"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
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
                onVariantNameChange(value);
              },
              value: filter.variant_name,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterPartner"]}
        </Typography>

        <LazyAutocomplete<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>
          {...{
            url: ADMIN_PARTNERS_END_POINT,
            placeholder: messages["filterPartner"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
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

              onChange: (e, value) => {
                onPartnerChange(value);
              },
              value: filter.partner,
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
