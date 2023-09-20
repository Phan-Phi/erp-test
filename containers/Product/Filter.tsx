import { Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { Button, Box, Typography, MenuItem } from "@mui/material";

import { LazyAutocomplete } from "compositions";
import { CommonFilterTableProps } from "interfaces";
import { ProductListFilterType } from "./ProductList";
import { SearchField, DateRangePicker, FilterByPriceRangeV2 } from "components";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_PRODUCTS_CATEGORIES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1,
  ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<ProductListFilterType> & {
  onSearchChange: (value: any) => void;
  onPriceStart: any;
  onPriceEnd: any;
  onClickFilterPrice: any;
  onCategoryChange: (value: any) => void;
  onPartnerChange: (value: any) => void;
  onOrderDateChange: any;
  onClickFilterOrderDate: any;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSearchChange,
    onPriceEnd,
    onPriceStart,
    onClickFilterPrice,
    onDateRangeChange,
    onFilterByTime,
    onCategoryChange,
    onPartnerChange,
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
          {messages["price"]}
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.price_start}
          initPriceEnd={filter.price_end}
          onChangePriceStart={onPriceStart}
          onChangePriceEnd={onPriceEnd}
          onFilterPrice={onClickFilterPrice}
        />
      </Box>

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
          {messages["filterProductCategory"]}
        </Typography>

        <LazyAutocomplete<Required<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1>>
          {...{
            url: ADMIN_PRODUCTS_CATEGORIES_END_POINT,
            placeholder: messages["filterProductCategory"] as string,
            shouldSearch: false,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.full_name;
              },

              value: filter.category,
              onChange: (e, value) => {
                onCategoryChange(value);
              },

              componentsProps: {
                popper: {
                  sx: {
                    minWidth: "250px !important",
                    left: 0,
                  },
                  placement: "bottom-start",
                },
              },
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
            shouldSearch: false,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              value: filter.partner,
              onChange: (e, value) => {
                onPartnerChange(value);
              },
              componentsProps: {
                popper: {
                  sx: {
                    minWidth: "250px !important",
                    left: 0,
                  },
                  placement: "bottom-start",
                },
              },
            },
            params: {
              nested_depth: 1,
              use_cache: false,
            },
          }}
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

// *
{
  /* <Search
        {...{
          label: messages["filterProductClass"],
          displayName: "name",
          url: PRODUCT_TYPE,
          passHandler: ({ value }) => {
            setExternalFilter({
              product_class: value?.id,
            });
          },
          params: {
            nested_depth: 1,
            use_cache: false,
          },
        }}
      /> */
}
{
  /* <Search
        {...{
          label: messages["filterProductAttribute"],
          displayName: "name",
          url: PRODUCT_ATTRIBUTE,
          passHandler: ({ value }) => {
            setExternalFilter({
              product_attribute: value?.id,
            });
          },
          params: {
            nested_depth: 1,
            use_cache: false,
          },
        }}
      /> */
}
{
  /* <Search
        {...{
          label: messages["filterVariantAttribute"],
          displayName: "name",
          url: PRODUCT_ATTRIBUTE,
          passHandler: ({ value }) => {
            setExternalFilter({
              variant_attribute: value?.id,
            });
          },
          params: {
            nested_depth: 1,
            use_cache: false,
          },
        }}
      /> */
}
// *
