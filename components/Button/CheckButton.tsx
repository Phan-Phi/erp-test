import React from "react";

import { IconButton, IconButtonProps } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";

const CheckButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <CheckIcon />
    </IconButton>
  );
};

export default CheckButton;
