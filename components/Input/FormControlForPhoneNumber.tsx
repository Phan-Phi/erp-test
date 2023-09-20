import React, { forwardRef } from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  Input,
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import PhoneInput from "react-phone-number-input/input";

import { E164Number } from "libphonenumber-js";

import { InputBase } from "./InputBase";
import { FormLabel } from "./FormLabel";

type InputPropsWithoutValueAndOnChange = Omit<
  InputProps,
  "value" | "onChange" | "inputComponent"
>;

type CommonProps = {
  label?: string;
  placeholder?: string;
  value?: E164Number | string;
  onChange?: (value?: E164Number) => void;
  InputProps?: Omit<InputProps, "inputComponent" | "onChange" | "value">;
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

export const FormControlForPhoneNumber = <T extends object>(props: Props<T>) => {
  const {
    name,
    label,
    value,
    control,
    onChange,
    placeholder,
    FormLabelProps,
    InputProps = {},
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
            field: { onChange, value },
            fieldState: { error },
          } = props;

          return (
            <FormControl {...FormControlProps} error={!!error}>
              <FormLabel children={label} {...FormLabelProps} />
              <PhoneInput
                inputComponent={
                  InputWithRef as (
                    props: InputPropsWithoutValueAndOnChange
                  ) => JSX.Element
                }
                country="VN"
                placeholder={placeholder}
                {...InputProps}
                value={value as E164Number & undefined}
                onChange={(value) => {
                  onChange(value);
                }}
              />
              <FormHelperText {...FormHelperTextProps} children={error?.message} />
            </FormControl>
          );
        }}
      />
    );
  } else {
    return (
      <FormControl {...FormControlProps}>
        <FormLabel children={label} {...FormLabelProps} />
        <PhoneInput
          inputComponent={
            InputWithRef as (props: InputPropsWithoutValueAndOnChange) => JSX.Element
          }
          country="VN"
          placeholder={placeholder}
          onChange={(value) => {
            if (onChange) {
              onChange(value);
            }
          }}
          value={value}
          {...InputProps}
        />
        <FormHelperText {...FormHelperTextProps} />
      </FormControl>
    );
  }
};

const InputWithRef = forwardRef(
  (props: InputProps, ref?: React.Ref<HTMLInputElement>) => {
    return <InputBase ref={ref} {...props} />;
  }
);
