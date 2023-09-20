import { Fragment } from "react";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";

import { usePermission } from "hooks";
import { Card, DateTimePicker, Switch } from "components";

type CheckboxProps = {
  control: any;
};

const Checkbox = ({ control }: CheckboxProps) => {
  const router = useRouter();
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_product");

  return (
    <Card
      title={messages["controlPanel"]}
      cardBodyComponent={() => {
        return (
          <Grid container spacing={3}>
            {router.query.variantId ? (
              <Fragment>
                <Grid item xs={12}>
                  <Switch
                    {...{
                      name: "track_inventory",
                      control,
                      label: (messages["trackInventory"] as string) || "",
                      FormControlProps: {
                        disabled: !writePermission,
                      },
                    }}
                  />
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item xs={12}>
                  <DateTimePicker
                    {...{
                      control,
                      name: "publication_date",
                      label: messages["publicationDate"] as string,
                      DateTimePickerProps: {
                        disabled: !writePermission,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DateTimePicker
                    {...{
                      control,
                      name: "available_for_purchase",
                      label: messages["availableForPurchase"] as string,
                      DateTimePickerProps: {
                        disabled: !writePermission,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Switch
                    {...{
                      control,
                      name: "is_published",
                      label: (messages["isPublished"] as string) || "",
                      FormControlProps: {
                        disabled: !writePermission,
                      },
                    }}
                  />
                </Grid>
              </Fragment>
            )}
          </Grid>
        );
      }}
    />
  );
};

export default Checkbox;
