import { useIntl } from "react-intl";
import { useState, useCallback } from "react";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useChoice } from "hooks";
import { FilterByTimeRange, Select, SearchField, DateRangePicker } from "components";

import { LazyAutocomplete } from "compositions";

import { CASH_TRANSACTION_TYPE, USER, CASH_PAYMENT_METHOD } from "apis";
import {
  CASH_PAYMENT_METHOD_ITEM,
  CASH_TRANSACTION_TYPE_ITEM,
  USER_ITEM,
} from "interfaces";

type FilterProps = {
  onFilterHandler: (key: any) => (value: any) => void;
  data?: Record<string, string>;
  reset: () => void;
  filter: any;
  onFlowType: (value: any) => void;
  onSourceType: (value: any) => void;
  resetFilter: (value: any) => void;
  onFilterByTime: any;
  onDateRangeChange: any;
  onPaymentMethodChange: (value: any) => void;
  onOwnerChange: (value: any) => void;
  onTypeChange: (value: any) => void;
  onSearch: (value: string | undefined) => void;
};

const Filter = ({
  onFilterHandler,
  data,
  reset,
  filter,
  onFlowType,
  onSourceType,
  resetFilter,
  onFilterByTime,
  onDateRangeChange,
  onPaymentMethodChange,
  onOwnerChange,
  onTypeChange,
  onSearch,
}: FilterProps) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  const resetStateHandler = useCallback(() => {
    reset();

    setIsReady(false);

    setTimeout(() => {
      setIsReady(true);
    }, 300);
  }, [reset]);

  if (!isReady) return null;

  const { transaction_source_types, transaction_flow_types } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={(value) => {
          onSearch(value);
        }}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Theo thời gian xác nhận
        </Typography>

        <DateRangePicker
          ranges={[filter.range]}
          onChange={(ranges) => {
            const range = ranges.range;
            range && onDateRangeChange && onDateRangeChange(range);
          }}
          onFilterByTime={onFilterByTime}
        />

        {/* <FilterByTimeRange
          onChangeDateStart={(e) => {
            onFilterHandler("date_confirmed_start")(e);
            onFilterHandler("date_start")(e);
          }}
          onChangeDateEnd={(e) => {
            onFilterHandler("date_confirmed_end")(e);
            onFilterHandler("date_end")(e);
          }}
          initDateStart={data?.date_confirmed_start || null}
          initDateEnd={data?.date_confirmed_end || null}
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterSourceType"]}
        </Typography>
        <Select
          renderItem={() => {
            return transaction_source_types.map((el) => {
              return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
            });
          }}
          SelectProps={{
            onChange: (e) => {
              onSourceType(e.target.value);
            },
            value: filter.source_type,
            placeholder: messages["filterSourceType"] as string,
          }}
        />
        {/* <Select
          {...{
            renderItem: () => {
              return transaction_source_types.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: data?.["source_type"] ?? "",
              onChange(event) {
                onFilterHandler("source_type")(event.target.value || "");
              },
              placeholder: messages["filterSourceType"] as string,
            },
          }}
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterFlowType"]}
        </Typography>

        <Select
          renderItem={() => {
            return transaction_flow_types.map((el) => {
              return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
            });
          }}
          SelectProps={{
            onChange: (e) => {
              onFlowType(e.target.value);
            },
            value: filter.flow_type,
            placeholder: messages["filterFlowType"] as string,
          }}
        />

        {/* <Select
          {...{
            renderItem: () => {
              return transaction_flow_types.map((el) => {
              
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.flow_type,
              onChange(event) {
                onFlowType("flow_type")(event.target.value || "");
              },
              placeholder: messages["filterFlowType"] as string,
            },
          }}
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterTransactionType"]}
        </Typography>

        <LazyAutocomplete<CASH_TRANSACTION_TYPE_ITEM>
          {...{
            url: CASH_TRANSACTION_TYPE,
            placeholder: messages["filterTransactionType"] as string,
            AutocompleteProps: {
              getOptionLabel: (option) => {
                return filter.type ? filter.type.name : option.name;
              },
              onChange: (_, value) => {
                onTypeChange(value);
              },
              value: filter.type,
            },
            initValue: null,
          }}
        />

        {/* <LazyAutocomplete<{}, CASH_TRANSACTION_TYPE_ITEM>
          {...{
            url: CASH_TRANSACTION_TYPE,
            placeholder: messages["filterTransactionType"] as string,

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
                onFilterHandler("type")(value?.id || null);
                onFilterHandler("payment_method")(null);
              },
            },
            params: {
              nested_depth: 1,
            },
            initValue: null,
          }}
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterPaymentMethod"]}
        </Typography>

        <LazyAutocomplete<CASH_PAYMENT_METHOD_ITEM>
          {...{
            url: CASH_PAYMENT_METHOD,
            placeholder: messages["filterPaymentMethod"] as string,
            AutocompleteProps: {
              getOptionLabel: (option) => {
                return filter.payment_method ? filter.payment_method.name : option.name;
              },
              onChange: (_, value) => {
                onPaymentMethodChange(value);
              },
              value: filter.payment_method,
            },
            initValue: null,
          }}
        />

        {/* <LazyAutocomplete<{}, CASH_PAYMENT_METHOD_ITEM>
          {...{
            url: CASH_PAYMENT_METHOD,
            placeholder: messages["filterPaymentMethod"] as string,

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
                onFilterHandler("payment_method")(value?.id || null);
                onFilterHandler("type")(null);
              },
            },
            params: {
              nested_depth: 1,
            },
            initValue: null,
          }}
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterOwner"]}
        </Typography>

        <LazyAutocomplete<USER_ITEM>
          {...{
            url: USER,
            placeholder: messages["filterOwner"] as string,
            AutocompleteProps: {
              getOptionLabel: (option) => {
                return filter.owner ? filter.owner.first_name : option.first_name;
              },
              onChange: (_, value) => {
                onOwnerChange(value);
              },
              value: filter.owner,
            },
            initValue: null,
          }}
        />

        {/* <LazyAutocomplete<{}, USER_ITEM>
          {...{
            url: USER,
            placeholder: messages["filterOwner"] as string,
            shouldSearch: true,
            AutocompleteProps: {
              renderOption(props, option) {
                const fullName = `${get(option, "last_name")} ${get(
                  option,
                  "first_name"
                )}`;

                return <MenuItem {...props} value={option.id} children={fullName} />;
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
                onFilterHandler("owner")(value?.id || null);
              },
            },
            params: {
              nested_depth: 1,
            },
            initValue: null,
          }}
        /> */}
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
