import React from "react";
import NumberFormat, { NumberFormatPropsBase } from "react-number-format";

import {
  InputProps,
  FormControl,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormHelperText,
} from "@mui/material";
import { FormLabel, InputBase } from "components";

export type InputNumberProps = {
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  InputProps?: Omit<
    InputProps,
    | keyof NumberFormatPropsBase<typeof InputBase>
    | "customInput"
    | keyof React.ComponentPropsWithRef<"input">
  >;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  NumberFormatProps?: Omit<NumberFormatPropsBase<typeof InputBase>, "customInput">;
};

const InputNumber = (props: InputNumberProps) => {
  const {
    readOnly,
    disabled,
    placeholder,
    InputProps,
    FormLabelProps,
    FormControlProps,
    NumberFormatProps,
    FormHelperTextProps,
  } = props;

  return (
    <FormControl {...FormControlProps}>
      <FormLabel {...FormLabelProps} />
      <NumberFormat
        allowNegative={false}
        thousandSeparator={true}
        customInput={CustomInput}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        {...InputProps}
        {...NumberFormatProps}
      />
      <FormHelperText {...FormHelperTextProps} />
    </FormControl>
  );
};

function CustomInput(props: InputProps) {
  return <InputBase {...props} />;
}

export default InputNumber;
