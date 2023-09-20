import React from "react";

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

type Props = {
  label?: string;
  CheckboxProps?: CheckboxProps;
  FormControlLabelProps?: FormControlLabelProps;
};

export const CheckboxItem = (props: Props) => {
  const { label, CheckboxProps, FormControlLabelProps } = props;

  return (
    <FormControlLabel
      control={<Checkbox {...CheckboxProps} />}
      label={label}
      {...FormControlLabelProps}
    />
  );
};
