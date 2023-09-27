import { Fragment, useMemo } from "react";
import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { isEmpty } from "lodash";
import { Grid, MenuItem, Autocomplete } from "@mui/material";

import { FormControl, InputForAutocomplete } from "compositions";

import { usePermission } from "hooks";
import { ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type CustomerTypeFormProps = {
  control: any;
  customerTypeData: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE[];
};

const CustomerTypeForm = (props: CustomerTypeFormProps) => {
  const { messages } = useIntl();
  const { customerTypeData } = props;
  const control = props.control as Control<ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE>;

  const { hasPermission: writePermission } = usePermission("write_customer_type");

  const customerTypeChildren = useMemo(() => {
    return (
      <Fragment>
        <Controller
          control={control}
          name="parent"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <Autocomplete
                options={customerTypeData}
                renderOption={(props, option) => {
                  return (
                    <MenuItem
                      {...props}
                      value={option.id}
                      sx={{
                        marginLeft: option.level * 1.5,
                        fontWeight: (theme) => {
                          if (option.level === 0) {
                            return theme.typography.fontWeightBold;
                          } else if (option.level === 1) {
                            return theme.typography.fontWeightMedium;
                          } else {
                            return theme.typography.fontWeightRegular;
                          }
                        },
                        fontSize: (theme) => {
                          if (option.level === 0) {
                            return "16px";
                          } else if (option.level === 1) {
                            return "15px";
                          } else {
                            return "14px";
                          }
                        },
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  );
                }}
                getOptionLabel={(option) => option.name}
                value={value as any}
                onChange={(_, value) => onChange(value)}
                renderInput={(props) => {
                  return (
                    <InputForAutocomplete
                      {...props}
                      label={messages["belongToCustomerType"] as string}
                      placeholder={messages["belongToCustomerType"] as string}
                      error={!!error}
                      errorMessage={error && error.message}
                    />
                  );
                }}
                disabled={!writePermission}
                isOptionEqualToValue={(option, value) => {
                  if (isEmpty(option) || isEmpty(value)) {
                    return true;
                  }

                  return option?.["id"] === value?.["id"];
                }}
              />
            );
          }}
        />
      </Fragment>
    );
  }, [customerTypeData]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["customerType"] as string}
                placeholder={messages["customerType"] as string}
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

      <Grid item xs={6}>
        {customerTypeChildren}
      </Grid>

      <Grid item xs={12}>
        <Controller
          control={control}
          name="description"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["customerTypeDescription"] as string}
                placeholder={messages["customerTypeDescription"] as string}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  sx: { padding: 1 },
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

export default CustomerTypeForm;
