import NumberFormat from "react-number-format";
import { useIntl } from "react-intl";
import { useController } from "react-hook-form";
import { forwardRef, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Input as MuiInput,
  FormHelperText,
} from "@mui/material";

const Input = ({
  control,
  FormControlProps = {},
  InputLabelProps = {},
  InputProps = {},
  inputType = "text",
  readOnly = false,
  name,
  ...props
}) => {
  const children = useMemo(() => {
    return control ? (
      <ComponentWithControl
        {...{
          control,
          FormControlProps,
          InputLabelProps,
          InputProps,
          inputType,
          name,
          readOnly,
          ...props,
        }}
      />
    ) : (
      <ComponentWithNoControl
        {...{
          FormControlProps,
          InputLabelProps,
          InputProps,
          readOnly,
          inputType,
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
  InputProps = {},
  readOnly,
  inputType,
}) => {
  return (
    <FormControl fullWidth {...FormControlProps}>
      <InputLabel {...InputLabelProps} />

      {inputType === "text" ? (
        <MuiInput
          {...{
            ...InputProps,
            ...(readOnly && {
              readOnly: true,
              disableUnderline: true,
            }),
          }}
        />
      ) : (
        <MuiInput
          {...{
            inputComponent: NumberFormatCustom,
            inputProps: InputProps,
            ...(readOnly && {
              readOnly: true,
              disableUnderline: true,
            }),
          }}
        />
      )}
    </FormControl>
  );
};

const ComponentWithControl = ({
  FormControlProps = {},
  InputLabelProps = {},
  InputProps: { onChange: inputOnChange = () => {}, ...restInputProps } = {},
  name,
  control,
  defaultValue = "",
  inputType,
  readOnly,
  ...props
}) => {
  const { messages } = useIntl();

  const {
    field: { ref, value, onChange: formHookOnChange, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <FormControl fullWidth error={!!error} {...FormControlProps}>
      <InputLabel htmlFor={name} {...InputLabelProps} />
      {inputType === "text" ? (
        <MuiInput
          {...{
            inputRef: ref,
            id: name,
            value,
            onChange: (e, ...rest) => {
              inputOnChange(e);
              formHookOnChange(e);
            },
            ...restProps,
            ...restInputProps,
            ...props,
            ...(readOnly && {
              readOnly: true,
              disableUnderline: true,
            }),
          }}
        />
      ) : (
        <MuiInput
          {...{
            inputRef: ref,
            value,
            id: name,
            inputComponent: NumberFormatCustom,

            inputProps: { onChange: formHookOnChange, ...restInputProps, ...props },
            ...restProps,
            ...(readOnly && {
              readOnly: true,
              disableUnderline: true,
            }),
          }}
        />
      )}

      {error && (
        <FormHelperText>
          {messages[`message.error.${error.type}`] || error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

const NumberFormatCustom = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;

  return (
    <NumberFormat
      {...{
        getInputRef: ref,
        onValueChange: (values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        },
        suffix: " ₫",
        isNumericString: true,
        allowNegative: true,
        thousandSeparator: true,
        ...rest,
      }}
    />
  );
});

export default Input;
