import React from "react";
import { Box, Typography } from "@mui/material";
import { FallbackProps } from "react-error-boundary";

function ErrorFallback(props: FallbackProps) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" color="error">
        Đã có lỗi xảy ra vui lòng thử lại sau!
      </Typography>
    </Box>
  );
}

export default ErrorFallback;
