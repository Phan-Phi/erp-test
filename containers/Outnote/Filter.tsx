import { useIntl } from "react-intl";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import get from "lodash/get";
import { useChoice } from "hooks";

import { LazyAutocomplete } from "compositions";
import { CommonFilterTableProps } from "interfaces";
import { OutnoteListFilterType } from "./OutnoteList";
import { SearchField, Select, DateRangePicker, FilterByPriceRangeV2 } from "components";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_WAREHOUSES_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { isEmpty } from "lodash";

type FilterProps = CommonFilterTableProps<OutnoteListFilterType> & {
  onSearchChange: (value: any) => void;
  onPriceStart: any;
  onPriceEnd: any;
  onClickFilterPrice: () => void;
  onOwnerChange: (value: any) => void;
  onStatusChange: (value: any) => void;
  onWarehouseChange: (value: any) => void;
  onVariantNameChange: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    onSearchChange,
    resetFilter,
    onDateRangeChange,
    onFilterByTime,
    onPriceStart,
    onPriceEnd,
    onClickFilterPrice,
    onOwnerChange,
    onStatusChange,
    onWarehouseChange,
    onVariantNameChange,
  } = props;

  const choice = useChoice();
  const { messages } = useIntl();
  const { stock_out_note_statuses } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
        placeholder={"Tìm kiếm theo mã phiếu"}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["dateCreated"]}
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
              return stock_out_note_statuses.map((el) => {
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
                return <MenuItem {...props} value={option.id} children={option.name} />;
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

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
