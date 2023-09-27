import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Control, Controller } from "react-hook-form";

import { get, isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import {
  FormControl,
  FormControlBase,
  LazyAutocomplete,
  FormControlForNumber,
} from "compositions";

import { useChoice, usePermission } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_WAREHOUSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type OutnoteFormProps = {
  control: any;
  defaultValues?: ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE;
};

const OutnoteForm = (props: OutnoteFormProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const { stock_out_note_statuses } = useChoice();
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");

  const { defaultValues } = props;

  const control =
    props.control as Control<ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE>;

  const status = get(defaultValues, "status");

  return (
    <Grid container justifyContent="flex-start">
      {router.query.id && (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: messages["outnoteSid"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["outnoteSid"] as string,
                value: get(defaultValues, "sid"),
              },
              readOnly: true,
            }}
          />
        </Grid>
      )}

      {router.query.id && (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: messages["status"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["status"] as string,
              },
              readOnly: true,
              value: status
                ? getDisplayValueFromChoiceItem(stock_out_note_statuses, status)
                : "-",
            }}
          />
        </Grid>
      )}

      {router.query.id ? (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: messages["warehouseName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["warehouseName"] as string,
                defaultValue: get(defaultValues, "warehouse.name"),
              },
              readOnly: true,
            }}
          />
        </Grid>
      ) : (
        <Fragment>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="warehouse"
              render={(props) => {
                const { field, fieldState } = props;
                const { value, onChange } = field;
                const { error } = fieldState;

                return (
                  <LazyAutocomplete
                    error={error}
                    url={ADMIN_WAREHOUSES_END_POINT}
                    label={messages["warehouseName"] as string}
                    placeholder={messages["warehouseName"] as string}
                    AutocompleteProps={{
                      ...(!writePermission && {
                        disabled: true,
                      }),
                      value: value as any,
                      onChange: (_, value) => {
                        onChange(value);
                      },
                      getOptionLabel: (option) => option.name,
                      renderOption: (props, option) => {
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
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={6}></Grid>
        </Fragment>
      )}

      <Grid item xs={6}>
        <Controller
          control={control}
          name="shipping_excl_tax"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["shippingExclTax"] as string}
                placeholder={messages["shippingExclTax"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                  decimalScale: 2,
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="shipping_incl_tax"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["shippingInclTax"] as string}
                placeholder={messages["shippingInclTax"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                  decimalScale: 2,
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="amount"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["amount"] as string}
                placeholder={messages["amount"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                  decimalScale: 2,
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="amount_incl_tax"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["amountInclTax"] as string}
                placeholder={messages["amountInclTax"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                  decimalScale: 2,
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
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
                placeholder={messages["note"] as string}
                FormControlProps={{
                  disabled: !writePermission,
                }}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  readOnly: !writePermission,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default OutnoteForm;
