import { useIntl } from "react-intl";
import { Grid, MenuItem } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { Select } from "components";
import { usePermission, useSetting, useChoice } from "hooks";
import { FormControl, FormControlForNumber, FormControlForSelect } from "compositions";
import { ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type ShippingMethodFormProps = {
  control: any;
};

const ShippingMethodForm = (props: ShippingMethodFormProps) => {
  const control =
    props.control as Control<ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE>;
  const choice = useChoice();

  const { hasPermission: writePermission } = usePermission("write_shipping_method");

  const { messages } = useIntl();
  const setting = useSetting();

  const { shipping_method_types } = choice;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["shippingMethodName"] as string}
                placeholder={messages["shippingMethodName"] as string}
                FormControlProps={{ required: true, disabled: !writePermission }}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return shipping_method_types.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["shippingMethodType"] as string}
                FormControlProps={{
                  required: true,
                  ...(!writePermission && {
                    disabled: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="price"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["shippingMethodPrice"] as string}
                label={messages["shippingMethodPrice"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
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
          name="price_incl_tax"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["priceInclTax"] as string}
                label={messages["priceInclTax"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
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
          name="minimum_order_price"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["minimumOrderPrice"] as string}
                label={messages["minimumOrderPrice"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
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
          name="maximum_order_price"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["maximumOrderPrice"] as string}
                label={messages["maximumOrderPrice"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
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
          name="minimum_order_weight"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["minimumOrderWeight"] as string}
                label={messages["minimumOrderWeight"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: ` ${setting.weight_unit}`,
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
          name="maximum_order_weight"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["maximumOrderWeight"] as string}
                label={messages["maximumOrderWeight"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: ` ${setting.weight_unit}`,
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
    </Grid>
  );
};

export default ShippingMethodForm;
