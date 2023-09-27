import { useIntl } from "react-intl";
import { Control, Controller } from "react-hook-form";

import { isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import { usePermission } from "hooks";
import { FormControl, LazyAutocomplete } from "compositions";
import { ADMIN_USERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type ShipperFormProps = {
  control: any;
};

const ShipperForm = (props: ShipperFormProps) => {
  const control = props.control as Control<ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE>;

  const { hasPermission: writePermission } = usePermission("write_shipper");

  const { messages } = useIntl();

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["shipperName"] as string}
                placeholder={messages["shipperName"] as string}
                FormControlProps={{
                  required: true,
                }}
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

      <Grid item xs={6}>
        <Controller
          name="user"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete
                url={ADMIN_USERS_END_POINT}
                error={error}
                label={messages["user"] as string}
                placeholder={messages["user"] as string}
                AutocompleteProps={{
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => {
                    return `${option.first_name}: ${option.email}`;
                  },
                  renderOption: (props, option) => {
                    let value: string | undefined;

                    value = `${option?.first_name}: ${option?.email}`;

                    return (
                      <MenuItem
                        {...props}
                        key={option.id}
                        value={option.id}
                        children={value}
                      />
                    );
                  },
                  isOptionEqualToValue: (option, value) => {
                    if (isEmpty(option) || isEmpty(value)) {
                      return true;
                    }

                    return option?.["id"] === value?.["id"];
                  },
                  ...(!writePermission && {
                    disabled: true,
                  }),
                }}
                params={{
                  nested_depth: 1,
                  is_staff: true,
                  page_size: 20,
                  is_not_shipper: true,
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
