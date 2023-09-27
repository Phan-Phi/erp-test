import React from "react";
import { useIntl } from "react-intl";
import { Button, ButtonProps } from "@mui/material";

export default function ButtonReset(props: ButtonProps) {
  const { messages } = useIntl();

  return (
    <Button color="error" variant="contained" {...props}>
      {messages["removeFilter"]}
    </Button>
  );
}
