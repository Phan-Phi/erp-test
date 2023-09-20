import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useController } from "react-hook-form";

import {
  FormControl,
  InputLabel,
  FormHelperText,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

const Select = ({
  control,
  FormControlProps = {},
  InputLabelProps = {},
  SelectProps = {},
  FormHelperTextProps = {},
  items,
  choiceKey,
  ...props
}) => {
  const children = useMemo(() => {
    items =
      typeof items === "function"
        ? items()
        : items.map((item) => {
            return (
              <MenuItem key={item[0]} value={item[0]}>
                {item[1]}
              </MenuItem>
            );
          });

    return control ? (
      <ComponentWithControl
        {...{
          control,
          FormControlProps,
          InputLabelProps,
          SelectProps,
          FormHelperTextProps,
          items,
          ...props,
        }}
      />
    ) : (
      <ComponentWithNoControl
        {...{
          FormControlProps,
          InputLabelProps,
          SelectProps,
          FormHelperTextProps,
          items,
          ...props,
        }}
      />
    );
  });

  return children;
};

const ComponentWithNoControl = ({
  FormControlProps = {},
  InputLabelProps = {},
  SelectProps = {},
  FormHelperTextProps = {},
  items,
  ...props
}) => {
  return (
    <FormControl fullWidth {...FormControlProps}>
      <InputLabel {...InputLabelProps} />
      <MuiSelect
        {...props}
        autoWidth
        variant="standard"
        defaultValue={""}
        {...props}
        {...SelectProps}
      >
        {items}
      </MuiSelect>
    </FormControl>
  );
};

const ComponentWithControl = ({
  name,
  control,
  defaultValue = "",
  FormControlProps = {},
  InputLabelProps = {},
  SelectProps = {},
  FormHelperTextProps = {},
  items,
  ...props
}) => {
  const {
    field: { ref, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  const { messages } = useIntl();

  return (
    <FormControl fullWidth error={!!error} {...FormControlProps}>
      <InputLabel htmlFor={name} {...InputLabelProps} />
      <MuiSelect
        autoWidth
        variant="standard"
        {...props}
        inputRef={ref}
        {...restProps}
        id={name}
        {...SelectProps}
      >
        {items}
      </MuiSelect>

      {!!error && (
        <FormHelperText {...FormHelperTextProps}>
          {messages[`message.error.${error.type}`] || error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Select;
