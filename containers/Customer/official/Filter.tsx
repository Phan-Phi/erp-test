import get from "lodash/get";
import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { useChoice } from "hooks";
import { ChoiceItem, CommonFilterTableProps } from "interfaces";

import { LazyAutocomplete } from "compositions";
import { CustomerFilterType } from "../ContainerListCustomer";
import { SearchField, Select, DateRangePicker } from "components";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_CUSTOMERS_TYPES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<CustomerFilterType> & {
  onChangeSearch: (value: any) => void;
  onChangeGender: (value: any) => void;
  onChangeStatus: (value: any) => void;
  onChangeUserType: (value: any) => void;
  onBirthDayChange: (range: Range) => void;
  onChangeCustomerType: (value: any) => void;
  onClickFilterBirthDay: any;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    onChangeSearch,
    onChangeGender,
    onChangeStatus,
    onChangeCustomerType,
    onChangeUserType,
    resetFilter,
    onDateRangeChange,
    onFilterByTime,
    onBirthDayChange,
    onClickFilterBirthDay,
  } = props;

  const choice = useChoice();
  const { messages } = useIntl();

  const inBusinessList = [
    ["true", "onBusiness"],
    ["false", "offBusiness"],
  ] as ChoiceItem[];

  const { genders } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onChangeSearch}
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
          {messages["filterGender"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return genders.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },

            SelectProps: {
              value: filter.gender || "",
              onChange: (e) => {
                onChangeGender(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterInBusiness"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return inBusinessList.map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {messages[el[1]]}
                  </MenuItem>
                );
              });
            },

            SelectProps: {
              value: filter.in_business || "",
              onChange: (e) => {
                onChangeStatus(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterCustomerType"]}
        </Typography>

        <LazyAutocomplete<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_CUSTOMERS_TYPES_END_POINT,
            placeholder: messages["filterCustomerType"] as string,
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
                onChangeCustomerType(value);
              },
              value: filter.type,
            },
            // params: {
            //   nested_depth: 1,
            // },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterSaleInCharge"]}
        </Typography>

        <LazyAutocomplete<ADMIN_USER_USER_VIEW_TYPE_V1>
          {...{
            url: ADMIN_USERS_END_POINT,
            placeholder: messages["filterSaleInCharge"] as string,
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

              value: filter.type_sale,
              onChange: (e, value) => {
                onChangeUserType(value);
              },
            },
            // params: {
            //   nested_depth: 1,
            //   is_staff: true,
            // },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["birthday"]}
        </Typography>

        <DateRangePicker
          ranges={[filter.birthday]}
          onChange={(ranges) => {
            const range = ranges.birthday;
            range && onBirthDayChange && onBirthDayChange(range);
          }}
          onFilterByTime={onClickFilterBirthDay}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
