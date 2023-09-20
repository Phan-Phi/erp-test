import React from "react";

import { IconButton, IconButtonProps } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const DeleteButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteButton;
