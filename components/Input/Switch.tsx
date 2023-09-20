import React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  Switch as MuiSwitch,
  SwitchProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import { FormLabel } from "./FormLabel";

type CommonProps = {
  label?: string;
  SwitchProps?: SwitchProps;
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

export function Switch<T extends object>(props: Props<T>) {
  const {
    name,
    label,
    control,
    SwitchProps,
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
          } = props;

          return (
            <FormControl {...FormControlProps}>
              <FormLabel children={label} {...FormLabelProps} />
              <MuiSwitch
                color="primary2"
                {...SwitchProps}
                onChange={onChange}
                checked={value as boolean}
                // inputRef={ref}
              />
              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel children={label} {...FormLabelProps} />
        <MuiSwitch color="primary2" {...SwitchProps} />
        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
}
