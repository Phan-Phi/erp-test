import { Grid } from "@mui/material";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { useIntl } from "react-intl";
import { usePermission } from "hooks";
import { FormControl } from "compositions";
import { WarehouseAddressSchemaProps } from "yups";
import { Province, District, Ward, FormControlForPhoneNumber } from "components";
// import FormControlForPhoneNumber from "compositions/Input/FormControlForPhoneNumber";

type WarehouseAddressFormProps = {
  control: Control<WarehouseAddressSchemaProps>;
  setValue: UseFormSetValue<WarehouseAddressSchemaProps>;
  watch: UseFormWatch<WarehouseAddressSchemaProps>;
};

const WarehouseAddressForm = ({
  control,
  watch,
  setValue,
}: WarehouseAddressFormProps) => {
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_warehouse");

  return (
    <Grid container spacing={3} marginTop={1}>
      <Grid item xs={6}>
        <Province
          {...{
            control,
            name: "province",
            watch,
            setValue,
            ...(!writePermission && {
              disabled: true,
            }),
          }}
        />

        {/* <Controller
          control={adminAddressControl}
          name="province"
          render={(props) => {
            return (
              <Province
                controlState={props}
                onChange={() => {
                  adminAddressSetValue("district", null);
                  adminAddressSetValue("ward", null);
                }}
              />
            );
          }}
        /> */}
      </Grid>
      <Grid item xs={6}>
        <District
          {...{
            control,
            name: "district",
            watch,
            setValue,
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
            watch,
            setValue,
            ...(!writePermission && {
              disabled: true,
            }),
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {/* <Controller
          control={control}
          name="phone_number"
          render={(props) => {
            return <FormControlForPhoneNumber controlState={props} />;
          }}
        /> */}
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

      <Grid item xs={12}>
        <Controller
          control={control}
          name="line1"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                placeholder={messages["address"] as string}
                FormControlProps={{ required: true }}
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

export default WarehouseAddressForm;
