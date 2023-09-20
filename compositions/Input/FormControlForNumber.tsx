import { UseControllerReturn } from "react-hook-form";
import { Box, Typography, styled } from "@mui/material";

import InputNumber, { InputNumberProps } from "./InputNumber";

type FormControlForNumberProps = {
  controlState: any;
  labelEndAdornment?: string;
  label?: React.ReactNode;
  placeholder?: string;
} & InputNumberProps;

const FormControlForNumber = (props: FormControlForNumberProps) => {
  const {
    labelEndAdornment,
    label,
    InputProps,
    placeholder,
    controlState,
    FormLabelProps,
    FormControlProps,
    NumberFormatProps,
    FormHelperTextProps,
    readOnly,
    disabled,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name, onChange, ref, value } = field;
  const { error } = fieldState;

  return (
    <InputNumber
      readOnly={readOnly}
      disabled={disabled}
      FormControlProps={{
        error: !!error,
        ...FormControlProps,
      }}
      FormLabelProps={{
        children: label,
        ...FormLabelProps,
        htmlFor: name,
      }}
      InputProps={{
        // endAdornment: InputProps?.endAdornment,
        // endAdornment: (
        //   <StyledEndAdornment>
        //     <Typography>{labelEndAdornment}</Typography>
        //   </StyledEndAdornment>
        // ),
        inputRef: ref,
        inputProps: {
          id: name,
          placeholder: placeholder,

          ...InputProps,
        },
      }}
      NumberFormatProps={{
        value,
        onValueChange: (values) => {
          const { floatValue } = values;
          if (floatValue == undefined) {
            return onChange(0);
          }
          onChange(floatValue);
        },
        ...NumberFormatProps,
      }}
      FormHelperTextProps={{ children: error && error.message, ...FormHelperTextProps }}
    />
  );
};

export default FormControlForNumber;

const StyledEndAdornment = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6E6E6",
    width: "65px !important",
    height: "2.5rem",
  };
});
