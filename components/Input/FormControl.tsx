import React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  InputProps,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  FormControl as MuiFormControl,
} from "@mui/material";

import { InputBase } from "./InputBase";
import { FormLabel } from "./FormLabel";

type CommonProps = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

type Props<T extends object> = CommonProps & ConditionalProps<T>;

export const FormControl = <T extends object>(props: Props<T>) => {
  const {
    name,
    label,
    control = undefined,
    InputProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={(props) => {
          const {
            field: { onChange, value, ref },
            fieldState: { error },
          } = props;

          return (
            <MuiFormControl {...FormControlProps} error={!!error}>
              <FormLabel children={label} {...FormLabelProps} />
              <InputBase
                placeholder={placeholder}
                {...InputProps}
                value={value}
                onChange={onChange}
                // inputRef={ref}
              />
              <FormHelperText {...FormHelperTextProps} children={error?.message} />
            </MuiFormControl>
          );
        }}
      />
    );
  } else {
    return (
      <MuiFormControl {...FormControlProps}>
        <FormLabel children={label} {...FormLabelProps} />
        <InputBase placeholder={placeholder} {...InputProps} />
        <FormHelperText {...FormHelperTextProps} />
      </MuiFormControl>
    );
  }
};
