import React from "react";

import { IconButton, IconButtonProps } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const CloseButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
