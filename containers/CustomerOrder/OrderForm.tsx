import { useIntl } from "react-intl";
import { useUpdateEffect } from "react-use";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetValue,
  UseFormClearErrors,
} from "react-hook-form";

import get from "lodash/get";
import { Grid, MenuItem } from "@mui/material";

import { usePermission } from "hooks";
import { FormControl, LazyAutocomplete, FormControlForPhoneNumber } from "compositions";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
  ADMIN_ORDERS_SHIPPING_METHODS_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

interface OrderFormProps {
  control: any;
  watch: any;
  setValue: any;
  clearErrors: any;
}

const OrderForm = (props: OrderFormProps) => {
  const { messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_order");

  const control = props.control as Control<ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE>;
  const watch = props.watch as UseFormWatch<ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE>;
  const setValue = props.setValue as UseFormSetValue<ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE>;
  const clearErrors =
    props.clearErrors as UseFormClearErrors<ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE>;

  useUpdateEffect(() => {
    const data = watch("receiver");

    if (data) {
      const firstName = get(data, "first_name");
      const lastName = get(data, "last_name");
      const email = get(data, "email");
      const mainPhoneNumber = get(data, "main_phone_number");

      setValue("receiver_name", `${lastName} ${firstName}`, {
        shouldDirty: true,
      });

      if (email === null) {
        setValue("receiver_email", "", {
          shouldDirty: true,
        });
      } else {
        setValue("receiver_email", `${email}`, {
          shouldDirty: true,
        });
      }

      setValue("receiver_phone_number", `${mainPhoneNumber}`, {
        shouldDirty: true,
      });

      clearErrors("receiver_phone_number");
    } else {
      setValue("receiver_name", ``, {
        shouldDirty: true,
      });

      setValue("receiver_email", ``, {
        shouldDirty: true,
      });

      setValue("receiver_phone_number", ``, {
        shouldDirty: true,
      });
    }
  }, [watch("receiver")]);

  return (
    <Grid container justifyContent={"flex-start"}>
      <Grid item xs={6}>
        <Controller
          name="channel"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;
            return (
              <LazyAutocomplete<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1>
                error={error}
                url={ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT}
                label={messages["purchaseChannelName"] as string}
                placeholder={messages["purchaseChannelName"] as string}
                AutocompleteProps={{
                  disabled: !writePermission,
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => option.name,
                  renderOption: (props, option) => {
                    return (
                      <MenuItem {...props} value={option.id} children={option.name} />
                    );
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="shipping_method"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;
            return (
              <LazyAutocomplete<ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1>
                error={error}
                required={true}
                url={ADMIN_ORDERS_SHIPPING_METHODS_END_POINT}
                label={messages["shippingMethodName"] as string}
                placeholder={messages["shippingMethodName"] as string}
                AutocompleteProps={{
                  disabled: !writePermission,
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => option.name,
                  renderOption: (props, option) => {
                    return (
                      <MenuItem {...props} value={option.id} children={option.name} />
                    );
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="receiver"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;
            return (
              <LazyAutocomplete<ADMIN_USER_USER_VIEW_TYPE_V1>
                url={ADMIN_USERS_END_POINT}
                error={error}
                label={messages["customerName"] as string}
                placeholder={messages["customerName"] as string}
                AutocompleteProps={{
                  disabled: !writePermission,
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => {
                    const firstName = get(option, "first_name");
                    const lastName = get(option, "last_name");
                    const main_phone_number = get(option, "main_phone_number");

                    let value = `${lastName} ${firstName}`;

                    if (main_phone_number) {
                      value = `${lastName} ${firstName} (${main_phone_number})`;
                    }

                    return value;
                  },
                  renderOption: (props, option) => {
                    const firstName = get(option, "first_name");
                    const lastName = get(option, "last_name");
                    const main_phone_number = get(option, "main_phone_number");

                    let value = `${lastName} ${firstName}`;

                    if (main_phone_number) {
                      value = `${lastName} ${firstName} (${main_phone_number})`;
                    }

                    return <MenuItem {...props} value={option.id} children={value} />;
                  },
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={6}>
        <Controller
          name="receiver_name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["receiverName"] as string}
                placeholder={messages["receiverName"] as string}
                InputProps={{
                  ...(watch("receiver") && {
                    readOnly: true,
                    disabled: true,
                  }),
                  ...(!writePermission && {
                    readOnly: true,
                    disableUnderline: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="receiver_email"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["receiverEmail"] as string}
                placeholder={messages["receiverEmail"] as string}
                InputProps={{
                  ...(watch("receiver") && {
                    readOnly: true,
                    disabled: true,
                  }),
                  ...(!writePermission && {
                    readOnly: true,
                    disableUnderline: true,
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
          name="receiver_phone_number"
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                label={messages["phoneNumber"] as string}
                InputProps={{
                  inputProps: {
                    placeholder: messages["phoneNumber"] as string,
                  },
                  ...(watch("receiver") && {
                    disabled: true,
                    readOnly: true,
                    ...(!writePermission && {
                      readOnly: true,
                      disableUnderline: true,
                    }),
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="customer_notes"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["note"] as string}
                placeholder={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: { padding: 1 },
                  ...(!writePermission && {
                    readOnly: true,
                    disableUnderline: true,
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

export default OrderForm;
