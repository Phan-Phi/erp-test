import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Grid, Stack } from "@mui/material";
import { useUpdateEffect } from "react-use";
import { Control, useWatch } from "react-hook-form";

import { usePermission } from "hooks";
import { Card, DateTimePicker, Switch } from "components";

type CheckboxProps = {
  control: any;
  setValue?: any;
};

const Checkbox = (props: CheckboxProps) => {
  const control = props.control as Control<any>;
  const setValue = props.setValue;

  const router = useRouter();
  const { messages } = useIntl();

  const isStopBusiness = useWatch({ control, name: "stop_business" });

  const { hasPermission: writePermission } = usePermission("write_product");

  useUpdateEffect(() => {
    if (!isStopBusiness) {
      setValue("available_for_purchase", new Date().toISOString());
    }
  }, [isStopBusiness]);

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
                  {isStopBusiness === false && (
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
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center"
                  >
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

                    <Switch
                      {...{
                        control,
                        name: "stop_business",
                        label: "Tạm ngừng kinh doanh",
                        FormControlProps: {
                          disabled: !writePermission,
                        },
                      }}
                    />
                  </Stack>
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
