import React from "react";

import {
  Radio,
  RadioProps,
  FormControlLabel,
  FormControlLabelProps,
} from "@mui/material";

type Props = {
  label?: string;
  RadioProps?: RadioProps;
  FormControlLabelProps?: FormControlLabelProps;
};

export const RadioItem = (props: Props) => {
  const { label, RadioProps, FormControlLabelProps } = props;

  return (
    <FormControlLabel
      control={<Radio {...RadioProps} />}
      label={label}
      {...FormControlLabelProps}
    />
  );
};
