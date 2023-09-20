import { useIntl } from "react-intl";
import { Grid } from "@mui/material";

import { usePermission } from "hooks";
import { Control, Controller } from "react-hook-form";
import { WarehouseSchemaProps } from "yups";
import { FormControl } from "compositions";

type WarehouseFormProps = {
  control: any;
};

const WarehouseForm = ({ control }: WarehouseFormProps) => {
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_warehouse");

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
                label={messages["warehouseName"] as string}
                placeholder={messages["warehouseName"] as string}
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
    </Grid>
  );
};

export default WarehouseForm;
