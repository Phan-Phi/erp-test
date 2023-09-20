import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Control, UseFormWatch, UseFormSetValue, Controller } from "react-hook-form";

import { Province, District, Ward } from "components";
import { FormControl, FormControlForPhoneNumber } from "compositions";

import { usePermission } from "hooks";
import { ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type AddressFormProps = {
  control: any;
  watch: any;
  setValue: any;
  isDisabled?: boolean;
};

const ControlledAddressForm = (props: AddressFormProps) => {
  const { isDisabled = false } = props;
  const control = props.control as Control<ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1>;
  const watch = props.watch as UseFormWatch<ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1>;
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1>;

  const { messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_order");

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={6}>
        <Province
          {...{
            control,
            name: "province",
            watch,
            setValue,
            disabled: isDisabled || !writePermission,
            InputProps: {
              readOnly: isDisabled,
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <District
          {...{
            control,
            name: "district",
            watch,
            setValue,
            disabled: isDisabled || !writePermission || !watch("province"),
            InputProps: {
              readOnly: isDisabled || !writePermission || !watch("province"),
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Ward
          {...{
            control,
            name: "ward",
            watch,
            setValue,
            disabled: isDisabled || !writePermission || !watch("district"),
            InputProps: {
              readOnly: isDisabled || !writePermission || !watch("district"),
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="line1"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                placeholder={messages["address"] as string}
                FormControlProps={{
                  required: true,
                  disabled: isDisabled,
                }}
                InputProps={{
                  readOnly: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="phone_number"
          control={control}
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                label={messages["phoneNumber"] as string}
                InputProps={{
                  inputProps: {
                    placeholder: messages["phoneNumber"] as string,
                  },
                }}
                FormControlProps={{
                  disabled: isDisabled,
                  ...(!writePermission && {
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
          name="notes"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["note"] as string}
                placeholder={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                  readOnly: !writePermission,
                }}
                FormControlProps={{
                  disabled: isDisabled,
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ControlledAddressForm;
