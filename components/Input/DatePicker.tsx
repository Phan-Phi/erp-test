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
  DatePicker as MuiDatePicker,
  DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
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
  DatePickerProps?: Omit<DatePickerProps<V, V>, "value" | "onChange" | "renderInput">;
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

export function DatePicker<T extends object, V extends Date | number | null | undefined>(
  props: Props<T, V>
) {
  const {
    name,
    label,
    value,
    control,
    onChange,
    InputProps,
    placeholder,
    FormLabelProps,
    DatePickerProps,
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
              <MuiDatePicker
                PaperProps={{
                  sx: {
                    ["& .Mui-selected"]: {
                      backgroundColor: (theme) => {
                        return `${theme.palette.primary2.light} !important`;
                      },
                    },
                  },
                }}
                inputFormat="dd/MM/yyyy"
                value={value as V}
                onChange={(value) => {
                  if (value == null) {
                    return onChange(null);
                  }

                  if (typeof value == "number") {
                    return onChange(new Date(value).toISOString());
                  }

                  onChange(value.toISOString());
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
                        children={error && error.message}
                        {...FormHelperTextProps}
                      />
                    </FormControl>
                  );
                }}
                {...DatePickerProps}
              />
            </LocalizationProvider>
          );
        }}
      />
    );
  } else if (!control && !name) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
          PaperProps={{
            sx: {
              ["& .Mui-selected"]: {
                backgroundColor: (theme) => {
                  return `${theme.palette.primary2.light} !important`;
                },
              },
            },
          }}
          inputFormat="dd/MM/yyyy"
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
          {...DatePickerProps}
        />
      </LocalizationProvider>
    );
  } else {
    return null;
  }
}
