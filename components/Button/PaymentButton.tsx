import React from "react";
import PaidIcon from "@mui/icons-material/Paid";
import { IconButton, IconButtonProps } from "@mui/material";

export default function PaymentButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <PaidIcon sx={{ color: "#757575" }} />
    </IconButton>
  );
}
