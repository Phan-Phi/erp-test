import { SnackbarProvider } from "notistack";
import React, { useCallback, useRef } from "react";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Snackbar = ({ children }: React.PropsWithChildren<{}>) => {
  const notistackRef = useRef<SnackbarProvider | null>(null);

  const dismissNotistackHandler = useCallback((key) => {
    return () => {
      if (notistackRef.current == undefined) {
        return;
      }
      notistackRef.current.closeSnackbar(key);
    };
  }, []);

  return (
    <SnackbarProvider
      ref={(ref) => {
        notistackRef.current = ref;
      }}
      preventDuplicate={true}
      autoHideDuration={4000}
      action={(key) => {
        return (
          <IconButton onClick={dismissNotistackHandler(key)}>
            <CloseIcon sx={{ color: "common.white" }} />
          </IconButton>
        );
      }}
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default Snackbar;
