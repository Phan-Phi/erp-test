import * as React from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  FormControl,
  FormHelperText,
  InputProps,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { InputBase } from "./InputBase";
import { FormLabel } from "./FormLabel";

type CommonProps<V> = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  DateTimePickerProps?: Omit<
    DateTimePickerProps<V, V>,
    "value" | "onChange" | "renderInput"
  >;
};

type ConditionalProps<T extends object, V> =
  | {
      control: Control<T, any>;
      name: Path<T>;
      value?: never;
      onChange?: never;
    }
  | {
      name?: never;
      control?: undefined;
      value: V;
      onChange: (value: unknown, keyboardInputValue?: string | undefined) => void;
    };

type Props<T extends object, V> = CommonProps<V> & ConditionalProps<T, V>;

export function DateTimePicker<
  T extends object,
  V extends Date | number | null | undefined,
>(props: Props<T, V>) {
  const {
    name,
    label,
    value,
    control,
    onChange,
    InputProps,
    placeholder,
    FormLabelProps,
    DateTimePickerProps,
    FormControlProps,
    FormHelperTextProps,
  } = props;

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={(props) => {
          const {
            field: { onChange, value },
            fieldState: { error },
          } = props;

          return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MuiDateTimePicker
                PaperProps={{
                  sx: {
                    ["& .Mui-selected"]: {
                      backgroundColor: (theme) => {
                        return `${theme.palette.primary2.light} !important`;
                      },
                    },
                  },
                }}
                inputFormat="dd/MM/yyyy HH:mm:ss"
                value={value as V}
                onChange={(value) => {
                  if (value == null) {
                    return onChange(null);
                  }

                  if (typeof value == "number") {
                    return onChange(new Date(value).toISOString());
                  }

                  onChange(value);
                  // onChange(value.toISOString());
                }}
                renderInput={(params) => {
                  const { InputProps: InternalInputProps, inputProps, inputRef } = params;

                  return (
                    <FormControl {...FormControlProps} error={!!error}>
                      <FormLabel children={label} {...FormLabelProps} />
                      <InputBase
                        {...InternalInputProps}
                        inputProps={inputProps}
                        ref={inputRef}
                        placeholder={placeholder}
                        {...InputProps}
                      />

                      <FormHelperText
                        {...FormHelperTextProps}
                        children={error?.message}
                      />
                    </FormControl>
                  );
                }}
                {...DateTimePickerProps}
              />
            </LocalizationProvider>
          );
        }}
      />
    );
  } else if (!control && !name) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDateTimePicker
          PaperProps={{
            sx: {
              ["& .Mui-selected"]: {
                backgroundColor: (theme) => {
                  return `${theme.palette.primary2.light} !important`;
                },
              },
            },
          }}
          inputFormat="dd/MM/yyyy HH:mm:ss"
          value={value}
          onChange={onChange}
          renderInput={(params) => {
            const { InputProps: InternalInputProps, inputProps, inputRef } = params;

            return (
              <FormControl {...FormControlProps}>
                <FormLabel children={label} {...FormLabelProps} />
                <InputBase
                  {...InternalInputProps}
                  inputProps={inputProps}
                  ref={inputRef}
                  placeholder={placeholder}
                  {...InputProps}
                />
                <FormHelperText {...FormHelperTextProps} />
              </FormControl>
            );
          }}
          {...DateTimePickerProps}
        />
      </LocalizationProvider>
    );
  } else {
    return null;
  }
}
