import { Fragment } from "react";
import { Grid, FormHelperText } from "@mui/material";
import { useRouter } from "next/router";

import { useIntl } from "react-intl";

import { Input, Select, Switch } from "components";
import { usePermission, useChoice } from "hooks";

const ShipperForm = ({ control }) => {
  const router = useRouter();
  const { messages } = useIntl();

  const { product_attribute_types } = useChoice();

  const { hasPermission: writePermission } = usePermission("write_attribute");

  return (
    <Grid container spacing={3}>
      {!router.query.id && (
        <Fragment>
          <Grid item xs={6}>
            <Select
              {...{
                name: "input_type",
                control,
                FormControlProps: {
                  required: true,
                },
                InputLabelProps: {
                  children: messages["attributeType"],
                },

                items: product_attribute_types,
              }}
            />
          </Grid>
          <Grid item xs={6}></Grid>
        </Fragment>
      )}

      <Grid item xs={6}>
        <Input
          {...{
            name: "name",
            control,
            InputLabelProps: {
              children: messages["attributeName"],
            },
            FormControlProps: {
              required: true,
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
                disableUnderline: true,
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            name: "is_variant_only",
            control,
            FormControlLabelProps: {
              label: messages["onlyVariant"],
            },
          }}
        />
        {router.query.id && messages["noteInProductAttributeForm"]}
      </Grid>
    </Grid>
  );
};

export default ShipperForm;
