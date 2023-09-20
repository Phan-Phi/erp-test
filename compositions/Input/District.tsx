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

import { DISTRICT } from "apis";
import { transformUrl } from "libs";
import { DistrictTuple } from "interfaces";
import InputForAutocomplete from "./InputForAutocomplete";

interface DistrictProps {
  controlState: any;
  province?: string;
  InputProps?: InputProps;
  onChange?: (value: any) => void;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  FormHelperTextProps?: FormHelperTextProps;
  readOnly?: boolean;
  disabled?: boolean;
}
const District = (props: DistrictProps) => {
  const {
    onChange: onChangeOuter,
    InputProps: OuterInputProps,
    controlState,
    FormControlProps,
    FormHelperTextProps,
    FormLabelProps,
    province,
    readOnly,
    disabled,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;
  const { onChange, ref, value } = field;
  const { error } = fieldState;

  const [isShown, toggleIsShown] = useToggle(false);

  const { data } = useSWR<DistrictTuple[]>(() => {
    if (isShown && province) {
      return transformUrl(DISTRICT, {
        country: "vn",
        step: 2,
        value: province,
      });
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
            label="Quận / Huyện"
            placeholder="Quận / Huyện"
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
      disabled={disabled || !province}
    />
  );
};

export default District;
