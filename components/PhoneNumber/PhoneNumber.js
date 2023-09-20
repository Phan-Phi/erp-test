import { useIntl } from "react-intl";
import { forwardRef, useMemo } from "react";
import { useController } from "react-hook-form";
import PhoneInput from "react-phone-number-input/input";
import { FormControl, InputLabel, Input, FormHelperText } from "@mui/material";

const CustomPhoneInput = forwardRef(function (props, ref) {
  return <Input {...props} inputRef={ref} />;
});

const PhoneNumberInput = ({
  control,
  FormControlProps = {},
  InputLabelProps = {},
  InputProps = {},
  ...props
}) => {
  const children = useMemo(() => {
    return control ? (
      <ComponentWithControl
        {...{ control, FormControlProps, InputLabelProps, InputProps, ...props }}
      />
    ) : (
      <ComponentWithNoControl
        {...{ FormControlProps, InputLabelProps, InputProps, ...props }}
      />
    );
  });

  return children;
};

const ComponentWithNoControl = () => {
  return null;
};

const ComponentWithControl = ({
  name = "phone_number",
  control,
  FormControlProps,
  InputLabelProps,
  InputProps,
  ...props
}) => {
  const { messages } = useIntl();

  const {
    field: { ref, value, ...restProps },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <FormControl fullWidth error={!!error} {...FormControlProps}>
      <InputLabel htmlFor={name} {...InputLabelProps}></InputLabel>

      <PhoneInput
        name={name}
        value={value}
        ref={ref}
        {...restProps}
        defaultCountry="VN"
        country="VN"
        inputComponent={CustomPhoneInput}
        style={{ marginTop: "16px" }}
        {...InputProps}
      />
      {!!error && (
        <FormHelperText>
          {messages[`message.error.${error.type}`] || error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PhoneNumberInput;
