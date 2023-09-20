import { Grid } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { useIntl } from "react-intl";
import { usePermission } from "hooks";
import { useRouter } from "next/router";
import { FormControl } from "compositions";
import { PaymentMethodSchemaProps } from "yups";

type PaymentMethodFormProps = {
  // control: Control<PaymentMethodSchemaProps>;
  control: any;
};

const PaymentMethodForm = ({ control }: PaymentMethodFormProps) => {
  const router = useRouter();

  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_payment_method");

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={
                  router.query.id
                    ? (messages["updatePaymentMethod"] as string)
                    : (messages["paymentMethod"] as string)
                }
                placeholder={
                  router.query.id
                    ? (messages["updatePaymentMethod"] as string)
                    : (messages["paymentMethod"] as string)
                }
                FormControlProps={{ required: true }}
                InputProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["paymentMethodDescription"] as string}
                placeholder={messages["paymentMethodDescription"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
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

export default PaymentMethodForm;
