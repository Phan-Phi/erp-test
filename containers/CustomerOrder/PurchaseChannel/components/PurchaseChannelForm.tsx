import { Grid } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { useIntl } from "react-intl";
import { usePermission } from "hooks";
import { FormControl } from "compositions";
import { PurchaseChannelSchemaProps } from "yups";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type ShipperFormProps = {
  control: Control<any>;
};

const ShipperForm = ({ control }: ShipperFormProps) => {
  const { hasPermission: writePermission } = usePermission("write_purchase_channel");

  const { messages } = useIntl();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["purchaseChannelName"] as string}
                placeholder={messages["purchaseChannelName"] as string}
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

      <Grid item xs={12}>
        <Controller
          control={control}
          name="description"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["purchaseChannelDescription"] as string}
                placeholder={messages["purchaseChannelDescription"] as string}
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

export default ShipperForm;
