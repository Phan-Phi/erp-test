import { useState } from "react";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { useChoice } from "hooks";
import { useIntl } from "react-intl";
import { LazyAutocomplete } from "compositions";
import { Select, SearchField, DateRangePicker } from "components";
import {
  ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1,
  ADMIN_USER_USER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import {
  ADMIN_CASH_PAYMENT_METHODS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
  ADMIN_USERS_END_POINT,
} from "__generated__/END_POINT";
import { isEmpty } from "lodash";

type FilterProps = {
  filter: any;
  reset: () => void;
  onFilterByTime: any;
  onDateRangeChange: any;
  data?: Record<string, string>;
  onFlowType: (value: any) => void;
  resetFilter: (value: any) => void;
  onTypeChange: (value: any) => void;
  onSourceType: (value: any) => void;
  onTransactionStatuses: (value: any) => void;
  onOwnerChange: (value: any) => void;
  onPaymentMethodChange: (value: any) => void;
  onSearch: (value: string | undefined) => void;
};

const Filter = ({
  data,
  reset,
  filter,
  onFlowType,
  onSourceType,
  resetFilter,
  onFilterByTime,
  onDateRangeChange,
  onPaymentMethodChange,
  onTransactionStatuses,
  onOwnerChange,
  onTypeChange,
  onSearch,
}: FilterProps) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  const { transaction_source_types, transaction_flow_types, transaction_statuses } =
    choice;

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
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterSourceType"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return transaction_source_types.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },

            SelectProps: {
              value: filter.source_type || "",
              onChange: (e) => {
                onSourceType(e.target.value);
              },
              placeholder: messages["filterSourceType"] as string,
            },
          }}
        />
        {/* <Select
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
        /> */}
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Trạng thái phiếu
        </Typography>
        <Select
          {...{
            renderItem() {
              return transaction_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },

            SelectProps: {
              value: filter.status || "",
              onChange: (e) => {
                onTransactionStatuses(e.target.value);
              },
              placeholder: "Trạng thái phiếu",
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterFlowType"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return transaction_flow_types.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },

            SelectProps: {
              value: filter.flow_type || "",
              onChange: (e) => {
                onFlowType(e.target.value);
              },
              placeholder: messages["filterFlowType"] as string,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterTransactionType"]}
        </Typography>

        <LazyAutocomplete<ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
            placeholder: messages["filterTransactionType"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },
              getOptionLabel: (option) => {
                return filter.type ? filter.type.name : option.name;
              },
              onChange: (_, value) => {
                onTypeChange(value);
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              value: filter.payment_method !== null ? null : filter.type,
              disabled: filter.payment_method !== null ? true : false,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterPaymentMethod"]}
        </Typography>

        <LazyAutocomplete<ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_CASH_PAYMENT_METHODS_END_POINT,
            placeholder: messages["filterPaymentMethod"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },
              getOptionLabel: (option) => {
                return filter.payment_method ? filter.payment_method.name : option.name;
              },
              onChange: (_, value) => {
                onPaymentMethodChange(value);
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              value: filter.type !== null ? null : filter.payment_method,
              disabled: filter.type !== null ? true : false,
            },

            initValue: null,
          }}
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
                return (
                  <MenuItem {...props} value={option.id} children={option.first_name} />
                );
              },
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
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
