import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import {
  Ward,
  Switch,
  Province,
  District,
  FormControl,
  FormControlForPhoneNumber,
} from "components";
import { FormControl as FormControlV2 } from "compositions";

import { UserAddressSchemaProps } from "yups";

import { Control, UseFormWatch, UseFormSetValue, Controller } from "react-hook-form";
import { ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

interface AddressFormProps {
  control: any;
  setValue: any;
  watch: any;
}
const AddressForm = (props: AddressFormProps) => {
  const { messages } = useIntl();
  const control = props.control as Control<ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;
  const watch = props.watch as UseFormWatch<ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Province {...{ control, name: "province", watch, setValue }} />
      </Grid>
      <Grid item xs={6}>
        <District {...{ control, name: "district", watch, setValue }} />
      </Grid>
      <Grid item xs={6}>
        <Ward {...{ control, name: "ward", watch, setValue }} />
      </Grid>

      <Grid item xs={6}></Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="line1"
          render={(props) => {
            return (
              <FormControlV2
                placeholder={messages["address"] as string}
                controlState={props}
                label={messages["address"] as string}
                FormControlProps={{
                  required: true,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlForPhoneNumber
          {...{
            control,
            name: "phone_number",
            label: messages["phoneNumber"] as string,
            placeholder: messages["phoneNumber"] as string,

            FormControlProps: {
              required: true,
            },
          }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "is_default_for_shipping",
            label: messages["defaultShippingAddress"] as string,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "is_default_for_billing",
            label: messages["defaultBillingAddress"] as string,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="notes"
          render={(props) => {
            return (
              <FormControlV2
                controlState={props}
                label={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
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

export default AddressForm;
