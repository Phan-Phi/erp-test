import { Fragment } from "react";
import { Controller, Control, Path } from "react-hook-form";

import {
  InputProps,
  FormControl,
  Autocomplete as MuiAutocomplete,
  FormLabelProps,
  FormHelperText,
  FormControlProps,
  CircularProgress,
  AutocompleteProps,
  FormHelperTextProps,
} from "@mui/material";

import { InputBase } from "./InputBase";
import { FormLabel } from "./FormLabel";

type CommonProps<V> = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  AutocompleteProps?: Omit<
    AutocompleteProps<V, boolean, undefined, undefined>,
    "renderInput"
  >;
  FormHelperTextProps?: FormHelperTextProps;
};

type ConditionalProps<T extends object> =
  | {
      control: Control<T, any>;
      name: Path<T>;
    }
  | { control?: undefined; name?: never };

type Props<T extends object, V> = CommonProps<V> & ConditionalProps<T>;

export const Autocomplete = <T extends object, V>(props: Props<T, V>) => {
  const {
    name,
    label,
    control,
    InputProps,
    placeholder,
    FormLabelProps,
    FormControlProps,
    AutocompleteProps,
    FormHelperTextProps,
  } = props;

  if (AutocompleteProps) {
    if (control && name) {
      return (
        <Controller
          name={name}
          control={control}
          render={(props) => {
            const {
              field: { value, onChange },
              fieldState: { error },
            } = props;

            return (
              <MuiAutocomplete
                disableCloseOnSelect={false}
                noOptionsText="Không có dữ liệu"
                renderInput={(params) => {
                  return (
                    <FormControl {...FormControlProps} id={params.id} error={!!error}>
                      <FormLabel children={label} {...FormLabelProps} />
                      <InputBase
                        placeholder={placeholder}
                        {...InputProps}
                        {...params.InputProps}
                        inputProps={params.inputProps}
                        endAdornment={
                          <Fragment>
                            {AutocompleteProps.loading ? (
                              <CircularProgress size={20} sx={{ marginRight: 1 }} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        }
                        size={params.size}
                      />
                      <FormHelperText
                        {...FormHelperTextProps}
                        children={error?.message}
                      />
                    </FormControl>
                  );
                }}
                value={value as V | null | undefined}
                onChange={(_, value) => {
                  onChange(value);
                }}
                loadingText={<CircularProgress size={20} />}
                {...AutocompleteProps}
              />
            );
          }}
        />
      );
    }

    return (
      <MuiAutocomplete
        disableCloseOnSelect={false}
        noOptionsText="Không có dữ liệu"
        renderInput={(params) => {
          return (
            <FormControl {...FormControlProps} id={params.id}>
              <FormLabel children={label} {...FormLabelProps} />
              <InputBase
                placeholder={placeholder}
                {...InputProps}
                {...params.InputProps}
                inputProps={{ ...params.inputProps }}
                endAdornment={
                  <Fragment>
                    {AutocompleteProps.loading ? (
                      <CircularProgress size={20} sx={{ marginRight: 1 }} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                }
                size={params.size}
              />
              <FormHelperText {...FormHelperTextProps} />
            </FormControl>
          );
        }}
        loadingText={<CircularProgress size={20} />}
        {...AutocompleteProps}
      />
    );
  } else {
    return null;
  }
};
