import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Control, Controller } from "react-hook-form";

import get from "lodash/get";
import { Grid } from "@mui/material";

import { usePermission } from "hooks";
import { FormControl, FormControlForNumber, InputNumber } from "compositions";
import { ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type PartnerFormProps = {
  control: any;
  defaultValues?: ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE;
};

const PartnerForm = ({ control, defaultValues }: PartnerFormProps) => {
  const router = useRouter();
  const _control = control as Control<ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE>;

  const { hasPermission: writePermission } = usePermission("write_partner");

  const { messages } = useIntl();

  return (
    <Grid container justifyContent="flex-start">
      <Grid item xs={12}>
        <Controller
          control={_control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["partnerName"] as string}
                placeholder={messages["partnerName"] as string}
                FormControlProps={{
                  required: true,
                  disabled: !writePermission,
                }}
                InputProps={{
                  readOnly: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      {router.query.id && (
        <Grid item xs={6}>
          <InputNumber
            FormControlProps={{ required: true, disabled: !writePermission }}
            placeholder={messages["totalDebtAmount"] as string}
            FormLabelProps={{ children: messages["totalDebtAmount"] as string }}
            readOnly={true}
            NumberFormatProps={{ value: get(defaultValues, "total_debt_amount") }}
          />
        </Grid>
      )}

      <Grid item xs={6}>
        <Controller
          name="max_debt"
          control={_control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["maxDebt"] as string}
                placeholder={messages["maxDebt"] as string}
                readOnly={!writePermission}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
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
          control={_control}
          name="tax_identification_number"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["taxIdentificationNumber"] as string}
                placeholder={messages["taxIdentificationNumber"] as string}
                InputProps={{
                  readOnly: !writePermission,
                }}
                FormControlProps={{
                  required: true,
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      {router.query.id && <Grid item xs={6} />}

      <Grid item xs={6}>
        <Controller
          control={_control}
          name="email"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["email"] as string}
                placeholder={messages["email"] as string}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={_control}
          name="contact_info"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Người phụ trách"
                placeholder="Người phụ trách"
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PartnerForm;
