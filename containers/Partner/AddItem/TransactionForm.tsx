import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useToggle, useUpdateEffect } from "react-use";
import { useMemo, useState, useEffect, Fragment } from "react";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";

import {
  Grid,
  MenuItem,
  Button,
  FormControl as OriginalFormControl,
} from "@mui/material";
import { get } from "lodash";

import {
  FormControl,
  FormControlBase,
  LazyAutocomplete,
  FormControlForNumber,
} from "compositions";
import { Select, FormLabel } from "components";

import { usePermission, useChoice } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";

import {
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
  ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1,
  ADMIN_CASH_TRANSACTION_TYPE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";
import {
  ADMIN_CASH_PAYMENT_METHODS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
} from "__generated__/END_POINT";

const ViewDetailLineDialog = dynamic(() => import("../../Cash/ViewDetailLineDialog"));

interface DEFAULT_VALUES_EXTENDS extends ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE {
  target_type: any;
}

type TransactionFormProps = {
  control: any;
  getValues: any;
  setValue: any;
  watch: any;
  defaultValues: DEFAULT_VALUES_EXTENDS;
};

const TransactionForm = (props: TransactionFormProps) => {
  const { hasPermission: writePermission } = usePermission("write_transaction");
  const router = useRouter();
  const choice = useChoice();
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);
  const [maxAmount, setMaxAmount] = useState(0);
  const { transaction_target_types } = useChoice();

  const { defaultValues } = props;
  const control = props.control as Control<ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE>;
  const getValues =
    props.getValues as UseFormGetValues<ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE>;

  const setValue =
    props.setValue as UseFormSetValue<ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE>;

  const watch = props.watch as UseFormWatch<ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE>;

  const sourceTypeListMemo = useMemo(() => {
    return [
      ["", "None"],
      ["stock.receiptorder", "Đơn nhập hàng"],
    ];
  }, []);

  useEffect(() => {
    const source = getValues("source_id");

    if (source) {
      const amount = parseFloat(get(source, "amount.incl_tax") || 0);
      const surcharge = parseFloat(get(source, "surcharge.incl_tax") || 0);
      const shippingCharge = parseFloat(get(source, "shipping_charge.incl_tax") || 0);
      const inMoney = parseFloat(
        get(source, "total_transaction_in_amount.incl_tax") || 0
      );
      const outMoney = parseFloat(
        get(source, "total_transaction_out_amount.incl_tax") || 0
      );

      const result = Math.abs(
        amount + surcharge + shippingCharge - Math.abs(inMoney - outMoney)
      );
      setValue("amount", result.toString());
      setMaxAmount(result);
    } else {
      setValue("amount", "0");
    }
  }, [watch("source_id")]);

  useUpdateEffect(() => {
    setValue("source_id", null);
    setValue("amount", "0");
  }, [watch("source_type")]);

  const sourceIdMemo = useMemo(() => {
    const sourceType = watch("source_type");

    const Component = (url: string) => {
      return (
        <Fragment>
          <Controller
            control={control}
            name="source_id"
            render={(props) => {
              const { field, fieldState } = props;
              const { value, onChange } = field;
              const { error } = fieldState;

              return (
                <LazyAutocomplete<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>
                  url={url}
                  error={error}
                  label={messages["sid"] as string}
                  placeholder={messages["sid"] as string}
                  params={{
                    can_be_paid: true,
                    partner: router.query.id,
                  }}
                  AutocompleteProps={{
                    value: value as ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
                    onChange: (_, value) => {
                      onChange(value);
                    },
                    renderOption: (props, option) => {
                      return (
                        <MenuItem {...props} value={option.id} children={option.sid} />
                      );
                    },
                    getOptionLabel: (option: any) => {
                      return option.sid;
                    },
                    ...(!writePermission && {
                      disabled: true,
                      readOnly: true,
                    }),
                  }}
                  // searchKey: "sid_icontains",
                />
              );
            }}
          />
        </Fragment>
      );
    };

    if (sourceType !== "") {
      return (
        <Fragment>
          {sourceType === "stock.receiptorder" &&
            Component(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT)}
        </Fragment>
      );
    } else {
      return null;
    }
  }, [watch("source_type")]);

  const { transaction_flow_types } = choice;

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
            readOnly: true,
            value: get(defaultValues, "target_name"),
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
          name="type"
          control={control}
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
                  ...(!writePermission && {
                    disabled: true,
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Select
          {...{
            name: "source_type",
            label: messages["sourceType"] as string,
            control,
            renderItem: () => {
              return sourceTypeListMemo.map((el) => {
                if (el[0] === "") {
                  return (
                    <MenuItem key={el[0]} value={el[0]}>
                      {messages["none"]}
                    </MenuItem>
                  );
                }

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
        {sourceIdMemo}
      </Grid>

      <Grid item xs={4}>
        {!!watch("source_id") && (
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
                  sourceType: watch("source_type"),
                  source: watch("source_id"),
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

                    // if (floatValue === undefined || isNaN(maxAmount)) {
                    //   return true;
                    // }
                    // if (floatValue <= maxAmount) {
                    //   return true;
                    // } else {
                    //   return false;
                    // }
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
                  value: value as ADMIN_CASH_PAYMENT_METHOD_VIEW_TYPE_V1,
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
                  ...(!writePermission && {
                    disabled: true,
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
          name="address"
          control={control}
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
};

export default TransactionForm;
