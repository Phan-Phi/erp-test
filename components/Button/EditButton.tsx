import React from "react";

import { IconButton, IconButtonProps } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

const EditButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <EditIcon />
    </IconButton>
  );
};

export default EditButton;
