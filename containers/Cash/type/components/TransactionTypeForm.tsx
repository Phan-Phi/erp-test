import { Grid } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { Switch } from "components";
import { useIntl } from "react-intl";
import { usePermission } from "hooks";
import { useRouter } from "next/router";
import { FormControl } from "compositions";
import { TransactionTypSchemaProps } from "yups";

type TransactionTypeFormProps = {
  control: Control<TransactionTypSchemaProps>;
};

const TransactionTypeForm = ({ control }: TransactionTypeFormProps) => {
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_transaction_type");

  const router = useRouter();

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
                    ? (messages["updateTransactionType"] as string)
                    : (messages["transactionType"] as string)
                }
                placeholder={
                  router.query.id
                    ? (messages["updateTransactionType"] as string)
                    : (messages["transactionType"] as string)
                }
                FormControlProps={{ required: true, disabled: !writePermission }}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "is_business_activity",
            label: (messages["businessActivity"] as string) || "",
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["transactionTypeDescription"] as string}
                placeholder={messages["transactionTypeDescription"] as string}
                FormControlProps={{ disabled: !writePermission }}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                  readOnly: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TransactionTypeForm;
