import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import dynamic from "next/dynamic";
import { useToggle } from "react-use";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";

import {
  Grid,
  MenuItem,
  Button,
  FormControl as OriginalFormControl,
} from "@mui/material";

import {
  Select,
  Switch,
  LazyAutocomplete,
  LoadingDynamic as Loading,
  FormControl,
  FormLabel,
  FormControlForNumber,
} from "components";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { CASH_PAYMENT_METHOD, CASH_TRANSACTION_TYPE } from "apis";
import { usePermission, useChoice } from "hooks";
import { TransactionSchemaProps } from "yups";
import { CASH_PAYMENT_METHOD_ITEM, CASH_TRANSACTION_TYPE_ITEM } from "interfaces";
import { FormControlForSelect } from "compositions";

const ViewDetailLineDialog = dynamic(() => import("../ViewDetailLineDialog"), {
  loading: () => {
    return <Loading />;
  },
});

interface TransactionFormProps<
  T extends TransactionSchemaProps = TransactionSchemaProps,
> {
  control: Control<T>;
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  defaultValues: T;
}

const TransactionForm = ({
  control,
  getValues,
  watch,
  defaultValues,
}: TransactionFormProps) => {
  const { hasPermission: writePermission } = usePermission("write_transaction");

  const choice = useChoice();

  const [open, toggle] = useToggle(false);

  const { messages } = useIntl();
  const [maxAmount, setMaxAmount] = useState(0);

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

      setMaxAmount(result);
    }
  }, []);

  const { transaction_flow_types, transaction_target_types } = choice;

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={4}>
        <Switch
          {...{
            name: "affect_creditor",
            control,
            label: messages["affectCreditor"] as string,
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl
          {...{
            label: messages["targetType"] as string,
            placeholder: messages["targetType"] as string,
            InputProps: {
              readOnly: true,
              value:
                messages[
                  `transaction_target_types.${get(defaultValues, "target_type")}`
                ] || "None",
            },
          }}
        />
      </Grid>

      <Grid item xs={4}></Grid>

      <Grid item xs={4}>
        <FormControl
          {...{
            label: messages["targetName"] as string,
            placeholder: messages["targetName"] as string,
            InputProps: {
              value: get(defaultValues, "target_name"),
              readOnly: true,
            },
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <Select
          {...{
            name: "flow_type",
            control,
            label: messages["flowType"] as string,
            renderItem: () => {
              return transaction_flow_types.map((el) => {
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
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <LazyAutocomplete<TransactionSchemaProps, CASH_TRANSACTION_TYPE_ITEM>
          {...{
            url: CASH_TRANSACTION_TYPE,
            control,
            name: "type",
            label: messages["transactionType"] as string,
            placeholder: messages["transactionType"] as string,
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
              ...(!writePermission && {
                disabled: true,
              }),
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <FormControl
          {...{
            label: messages["sourceType"] as string,
            placeholder: messages["sourceType"] as string,

            InputProps: {
              readOnly: true,
              value:
                messages[
                  `transaction_source_types.${get(defaultValues, "source_type")}`
                ] || "None",
            },
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <FormControl
          {...{
            label: messages["noteSid"] as string,
            placeholder: messages["noteSid"] as string,
            InputProps: {
              value: get(defaultValues, "source_id.sid"),
              readOnly: true,
            },
          }}
        />
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
        <FormControlForNumber
          {...{
            name: "amount",
            control,
            label: messages["amount"] as string,

            NumberFormatProps: {
              allowNegative: false,
              isAllowed: ({ floatValue }) => {
                if (
                  floatValue === undefined ||
                  isNaN(maxAmount) ||
                  ["", "stock.receiptorder"].includes(getValues("source_type"))
                ) {
                  return true;
                }

                if (floatValue <= maxAmount) {
                  return true;
                } else {
                  return false;
                }
              },
              suffix: " ₫",
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <LazyAutocomplete<TransactionSchemaProps, CASH_PAYMENT_METHOD_ITEM>
          {...{
            url: CASH_PAYMENT_METHOD,
            control,
            name: "payment_method",
            label: messages["paymentMethod"] as string,
            placeholder: messages["paymentMethod"] as string,
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
              ...(!writePermission && {
                disabled: true,
              }),
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl
          {...{
            name: "address",
            control,
            label: messages["address"] as string,
            FormControlProps: {
              ...(!writePermission && {
                disabled: true,
              }),
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl
          {...{
            name: "notes",
            control,
            label: messages["note"] as string,
            InputProps: {
              multiline: true,
              rows: 5,
              sx: {
                padding: 1,
              },
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TransactionForm;
