import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import React, { useEffect } from "react";

import {
  Grid,
  Button,
  MenuItem,
  FormControl as OriginalFormControl,
} from "@mui/material";
import { get, isEmpty } from "lodash";

import {
  FormControl,
  FormControlBase,
  LazyAutocomplete,
  FormControlForNumber,
} from "compositions";
import { FormLabel, Select, LoadingDynamic as Loading } from "components";

import { useChoice, usePermission } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";

import {
  ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1,
  ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import {
  ADMIN_CASH_PAYMENT_METHODS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

const ViewDetailLineDialog = dynamic(() => import("../../../Cash/ViewDetailLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

interface DEFAULT_VALUES_EXTENDS extends ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE {
  target_type: any;
}

type FormPaymentProps = {
  control: any;
  getValues: any;
  setValue: any;
  watch: any;
  defaultValues: DEFAULT_VALUES_EXTENDS;
};

export default function FormPayment(props: FormPaymentProps) {
  const { defaultValues } = props;

  const choice = useChoice();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const { hasPermission: writePermission } = usePermission("write_transaction");

  type T = DEFAULT_VALUES_EXTENDS;

  const control = props.control as Control<T>;

  const getValues = props.getValues as UseFormGetValues<T>;

  const setValue = props.setValue as UseFormSetValue<T>;

  const watch = props.watch as UseFormWatch<T>;

  const { transaction_target_types } = useChoice();

  const { transaction_flow_types } = choice;

  useEffect(() => {
    if (defaultValues == undefined) return;

    const source = get(defaultValues, "source");

    const amount = parseFloat(get(source, "amount.incl_tax") || 0);
    const surcharge = parseFloat(get(source, "surcharge.incl_tax") || 0);
    const shippingCharge = parseFloat(get(source, "shipping_charge.incl_tax") || 0);
    const inMoney = parseFloat(get(source, "total_transaction_in_amount.incl_tax") || 0);
    const outMoney = parseFloat(
      get(source, "total_transaction_out_amount.incl_tax") || 0
    );

    const result = Math.abs(
      amount + surcharge + shippingCharge - Math.abs(inMoney - outMoney)
    );

    const lastResult: any = result;

    setValue("amount", lastResult);
  }, [defaultValues]);

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={4} />

      <Grid item xs={4}>
        <FormControlBase
          FormLabelProps={{ children: messages["targetType"] as string }}
          InputProps={{
            inputProps: {
              placeholder: messages["targetType"] as string,
            },
            readOnly: true,
            value: getDisplayValueFromChoiceItem(
              transaction_target_types,
              get(defaultValues, "target_type")
            ),
          }}
        />
      </Grid>

      <Grid item xs={4} />

      <Grid item xs={4}>
        <FormControlBase
          FormLabelProps={{ children: messages["targetName"] as string }}
          InputProps={{
            inputProps: {
              placeholder: messages["targetName"] as string,
            },
            value: get(defaultValues, "target_name"),
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Select
          {...{
            name: "flow_type",
            label: messages["flowType"] as string,
            control,
            renderItem: () => {
              return transaction_flow_types.map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {el[1]}
                  </MenuItem>
                );
              });
            },

            FormControlProps: {
              required: true,
              ...(!writePermission && {
                disabled: true,
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name="type"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete<ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1>
                error={error}
                url={ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT}
                label={messages["transactionType"] as string}
                placeholder={messages["transactionType"] as string}
                AutocompleteProps={{
                  value: value as ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1,
                  onChange: (_, value) => {
                    onChange(value);
                  },
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
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <FormControlBase
          FormLabelProps={{ children: messages["sourceType"] as string }}
          InputProps={{ readOnly: true, value: "Hóa đơn" }}
        />
      </Grid>

      <Grid item xs={4}>
        <FormControlBase
          FormLabelProps={{ children: messages["sid"] as string }}
          InputProps={{
            readOnly: true,
            inputProps: { placeholder: messages["sid"] as string },
            value: get(defaultValues, "source_id"),
          }}
        />
      </Grid>

      <Grid item xs={4}>
        {get(defaultValues, "source_type") === "order.invoice" && (
          <OriginalFormControl>
            <FormLabel
              children="Label"
              sx={{
                visibility: "hidden",
              }}
            />
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
              }}
              onClick={() => {
                toggle(true);
              }}
            >
              {messages["viewDetail"]}
            </Button>
            {open && (
              <ViewDetailLineDialog
                {...{
                  open,
                  toggle,
                  sourceType: get(defaultValues, "source_type"),
                  source: get(defaultValues, "source"),
                }}
              />
            )}
          </OriginalFormControl>
        )}
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name="amount"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["amount"] as string}
                NumberFormatProps={{
                  allowNegative: false,

                  isAllowed: ({ floatValue }) => {
                    return true;
                  },
                  suffix: " ₫",
                }}
                disabled={!writePermission}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Controller
          control={control}
          name="payment_method"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete<ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1>
                error={error}
                url={ADMIN_CASH_PAYMENT_METHODS_END_POINT}
                label={messages["paymentMethod"] as string}
                placeholder={messages["paymentMethod"] as string}
                AutocompleteProps={{
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  value: value as ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1,
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
                  ...(!writePermission && {
                    readOnly: true,
                    disabled: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="address"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                FormControlProps={{
                  ...(!writePermission && {
                    disabled: true,
                  }),
                }}
                InputProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="notes"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
}
