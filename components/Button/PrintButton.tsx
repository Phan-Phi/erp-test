import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

const PrintButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <PrintIcon />
    </IconButton>
  );
};

export default PrintButton;
