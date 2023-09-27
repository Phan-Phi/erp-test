import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import { Switch } from "components";
import { FormControlForNumber, LazyAutocomplete } from "compositions";

import { usePermission } from "hooks";
import { ADMIN_ORDERS_SHIPPERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE_EXTENDS } from "./EditInvoiceDialog";

type InvoiceFormProps = {
  control: any;
};

const InvoiceForm = (props: InvoiceFormProps) => {
  const control =
    props.control as Control<ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE_EXTENDS>;
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const { messages } = useIntl();

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={6}>
        <Controller
          control={control}
          name="shipper"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete<ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1>
                error={error}
                params={{
                  nested_depth: 1,
                }}
                url={ADMIN_ORDERS_SHIPPERS_END_POINT}
                label={messages["shipperName"] as string}
                placeholder={messages["shipperName"] as string}
                required={true}
                AutocompleteProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                  value: value as ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1,
                  onChange: (_, value) => {
                    onChange(value);
                  },

                  renderOption: (props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        key={option.id}
                        value={option?.id}
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
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="surcharge"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["surcharge"] as string}
                placeholder={messages["surcharge"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                readOnly={!writePermission}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="shipping_excl_tax"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["shippingExclTax"] as string}
                placeholder={messages["shippingExclTax"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                readOnly={!writePermission}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="shipping_incl_tax"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["shippingInclTax"] as string}
                placeholder={messages["shippingInclTax"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                readOnly={!writePermission}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "cod",
            label: (messages["cod"] as string) || "",
            SwitchProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default InvoiceForm;
