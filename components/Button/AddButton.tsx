import React from "react";

import { IconButton, IconButtonProps } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const AddButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <AddIcon />
    </IconButton>
  );
};

export default AddButton;
