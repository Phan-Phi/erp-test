import { useMemo } from "react";

import { useIntl } from "react-intl";
import { useController } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch as MuiSwitch,
} from "@mui/material";

const Switch = ({
  control,
  FormControlProps = {},
  FormControlLabelProps = {},
  FormHelperTextProps = {},
  ...props
}) => {
  const children = useMemo(() => {
    return control ? (
      <ComponentWithControl
        {...{
          control,
          FormControlProps,
          FormControlLabelProps,
          FormHelperTextProps,
          ...props,
        }}
      />
    ) : (
      <ComponentWithNoControl
        {...{ FormControlProps, FormControlLabelProps, FormHelperTextProps, ...props }}
      />
    );
  });

  return children;
};

const ComponentWithNoControl = ({
  FormControlProps,
  FormControlLabelProps,
  FormHelperTextProps,
  ...props
}) => {
  return (
    <FormControl fullWidth {...FormControlProps}>
      <FormControlLabel control={<MuiSwitch {...props} />} {...FormControlLabelProps} />
    </FormControl>
  );
};

const ComponentWithControl = ({
  name,
  control,
  defaultValue = false,
  FormControlProps,
  FormControlLabelProps,
  FormHelperTextProps,
  ...props
}) => {
  const {
    field: { ref, value, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const { messages } = useIntl();

  return (
    <FormControl fullWidth error={!!error} {...FormControlProps}>
      <FormControlLabel
        control={<MuiSwitch inputRef={ref} checked={value} {...props} {...restProps} />}
        {...FormControlLabelProps}
      />

      {!!error && (
        <FormHelperText {...FormHelperTextProps}>
          {messages[`message.error.${error.type}`] || error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Switch;
