import { useIntl } from "react-intl";
import { Control, UseFormSetValue, UseFormWatch, Controller } from "react-hook-form";

import { Grid } from "@mui/material";

import { usePermission } from "hooks";
import { Province, District, Ward } from "components";
import { FormControl, FormControlForPhoneNumber } from "compositions";
import { ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type PartnerAddressFormProps = {
  control: any;
  setValue: any;
  watch: any;
};

const PartnerAddressForm = (props: PartnerAddressFormProps) => {
  const { messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_partner");

  const control = props.control as Control<ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  const watch =
    props.watch as UseFormWatch<ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={6}>
        <Province
          {...{
            control,
            name: "province",
            setValue,
            watch,
            ...(!writePermission && {
              disabled: true,
            }),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <District
          {...{
            control,
            name: "district",
            setValue,
            watch,
            ...(!writePermission && {
              disabled: true,
            }),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Ward
          {...{
            control,
            name: "ward",
            setValue,
            watch,
            ...(!writePermission && {
              disabled: true,
            }),
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="phone_number"
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                label={messages["phoneNumber"] as string}
                InputProps={{
                  inputProps: { placeholder: messages["phoneNumber"] as string },
                }}
                FormControlProps={{
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
          name="line1"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                FormControlProps={{ required: true }}
                label={messages["address"] as string}
                placeholder={messages["address"] as string}
                InputProps={{
                  required: true,
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

export default PartnerAddressForm;
