import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { usePermission } from "hooks";

import { Switch } from "components";
import { DEFAULT_VALUES_EXTENDS_TYPE } from "../EditType";
import { FormControl, FormControlForNumber } from "compositions";

type ProductTypeFormProps = {
  control: any;
};

const ProductTypeForm = (props: ProductTypeFormProps) => {
  const control = props.control as Control<DEFAULT_VALUES_EXTENDS_TYPE>;
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_product_class");

  return (
    <Grid container>
      <Grid item xs={8}>
        <Controller
          name="name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["productType"] as string}
                placeholder={messages["productType"] as string}
                FormControlProps={{
                  required: true,
                  disabled: !writePermission,
                }}
                InputProps={{ readOnly: !writePermission }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <Controller
          name="tax_rate"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["taxRate"] as string}
                placeholder={messages["taxRate"] as string}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " %",
                  isAllowed: (values) => {
                    return values.value.length <= 5;
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            name: "has_variants",
            control,

            label: messages["hasVariant"] as string,

            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={6} />
    </Grid>
  );
};

export default ProductTypeForm;
