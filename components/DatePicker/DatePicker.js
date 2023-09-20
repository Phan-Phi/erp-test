import { useMemo } from "react";
import { useController } from "react-hook-form";
import { LocalizationProvider, DatePicker as MuiDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import viLocale from "date-fns/locale/vi";
import { TextField } from "@mui/material";
import { useIntl } from "react-intl";

const DateTimePicker = ({ control, ...props }) => {
  const children = useMemo(() => {
    return control ? (
      <ComponentWithControl {...{ control, ...props }} />
    ) : (
      <ComponentWithNoControl {...{}} />
    );
  });

  return children;
};

const ComponentWithNoControl = () => {};

const ComponentWithControl = ({ name, control, ...props }) => {
  const {
    field: { ref, value, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const { messages } = useIntl();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
      <MuiDatePicker
        {...{
          inputRef: ref,
          value,
          renderInput: (params) => {
            return (
              <TextField
                {...params}
                error={!!error}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: {
                    paddingLeft: 2,
                  },
                }}
                variant="standard"
                helperText={!!error && messages[error.type]}
              />
            );
          },
          ...restProps,
          ...props,
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
