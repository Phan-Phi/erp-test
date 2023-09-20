import useSWR from "swr";
import { useToggle } from "react-use";
import React, { useCallback } from "react";
import { UseControllerReturn } from "react-hook-form";

import {
  InputProps,
  Autocomplete,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
} from "@mui/material";

import { WARD } from "apis";
import { WardTuple } from "interfaces";
import InputForAutocomplete from "./InputForAutocomplete";

interface WardProps {
  controlState: any;
  province?: string;
  district?: string;
  onChange?: (value: any) => void;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  readOnly?: boolean;
  disabled?: boolean;
}

const District = (props: WardProps) => {
  const {
    province,
    district,
    controlState,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
    onChange: onChangeOuter,
    InputProps: OuterInputProps,
    readOnly,
    disabled,
  } = props;
  const { field, fieldState } = controlState as UseControllerReturn;
  const { onChange, ref, value } = field;
  const { error } = fieldState;

  const [isShown, toggleIsShown] = useToggle(false);

  const { data } = useSWR<WardTuple[]>(() => {
    if (isShown && district && province) {
      return `${WARD}?country=vn&value=${province}&step=2&value=${district}&step=3`;
    }
  });

  const onChangeHandler = useCallback(
    (_, value) => {
      onChange(value);
      onChangeOuter && onChangeOuter(value);
    },
    [onChange, onChangeOuter]
  );

  return (
    <Autocomplete
      readOnly={readOnly}
      options={data ?? []}
      open={isShown}
      value={value}
      onChange={onChangeHandler}
      onOpen={() => toggleIsShown(true)}
      onClose={() => toggleIsShown(false)}
      renderInput={(props) => {
        return (
          <InputForAutocomplete
            FormControlProps={FormControlProps}
            {...props}
            label="Phường / Xã"
            placeholder="Phường / Xã"
            error={!!error}
            errorMessage={error && error.message}
            FormLabelProps={FormLabelProps}
            FormHelperTextProps={FormHelperTextProps}
            InputProps={{ ...props.InputProps, ...OuterInputProps, inputRef: ref }}
          />
        );
      }}
      loading={!data && isShown}
      getOptionLabel={(option) => option["1"]}
      disabled={disabled || !district}
    />
  );
};

export default District;
