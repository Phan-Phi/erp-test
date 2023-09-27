import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { get, isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import { FormControlForNumber, LazyAutocomplete } from "compositions";
import { ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE } from "__generated__/PATCH_YUP";

interface SaleInChargeFormProps {
  control: any;
  url: string;
}

const SaleInChargeForm = (props: SaleInChargeFormProps) => {
  const { messages } = useIntl();
  const { url } = props;
  const control = props.control as Control<ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="max_debt"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                FormLabelProps={{ children: messages["maxDebt"] as string }}
                placeholder={messages["maxDebt"] as string}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="sales_in_charge"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete
                url={url}
                error={error}
                label={messages["saleInCharge"] as string}
                placeholder={messages["saleInCharge"] as string}
                params={{
                  is_staff: true,
                }}
                AutocompleteProps={{
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => {
                    const lastName = get(option, "last_name");
                    const firstName = get(option, "first_name");
                    const fullName = `${lastName} ${firstName}`;

                    return fullName;
                  },
                  renderOption: (props, option) => {
                    const lastName = get(option, "last_name");
                    const firstName = get(option, "first_name");
                    const fullName = `${lastName} ${firstName}`;

                    return (
                      <MenuItem
                        {...props}
                        key={option.id}
                        value={option.id}
                        children={fullName}
                      />
                    );
                  },
                  isOptionEqualToValue: (option, value) => {
                    if (isEmpty(option) || isEmpty(value)) {
                      return true;
                    }

                    return option?.["id"] === value?.["id"];
                  },
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SaleInChargeForm;
