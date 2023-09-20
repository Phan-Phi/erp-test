import { Controller } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";

import { useIntl } from "react-intl";
import { usePermission, useChoice } from "hooks";
import { Select, DateTimePicker } from "components";
import { FormControl, FormControlForSelect, FormControlForNumber } from "compositions";

const DiscountForm = ({ control, watch }) => {
  const choice = useChoice();

  const { hasPermission: writePermission } = usePermission("write_sale");

  const { messages } = useIntl();

  const { discount_types } = choice;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["discountName"] as string}
                placeholder={messages["discountName"] as string}
                FormControlProps={{
                  required: true,
                }}
                InputProps={{
                  readOnly: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="discount_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return discount_types.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label={messages["discountType"] as string}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="discount_amount"
          render={(props) => {
            return (
              <FormControlForNumber
                placeholder={messages["discountAmount"] as string}
                label={messages["discountAmount"] as string}
                controlState={props}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: watch("discount_type") === "Absolute" ? " ₫" : " %",
                }}
                readOnly={!writePermission}
                FormControlProps={{
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_start",
            label: messages["dateStart"] as string,
            DateTimePickerProps: {
              disabled: !writePermission,
            },
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_end",
            label: messages["dateEnd"] as string,
            DateTimePickerProps: {
              disabled: !writePermission,
              minDateTime: watch("date_start"),
            },
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DiscountForm;
