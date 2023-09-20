import React from "react";
import { Box, BoxProps, styled } from "@mui/material";

export default function WrapperTable({ children, ...restProps }: BoxProps) {
  return <StyledWrapper {...restProps}>{children}</StyledWrapper>;
}

const StyledWrapper = styled(Box)(() => {
  return {
    // padding: "8px 0 0 24px",
    borderRadius: 4,
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  };
});
