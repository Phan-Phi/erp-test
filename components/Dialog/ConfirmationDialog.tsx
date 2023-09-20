import {
  Button,
  Dialog,
  DialogProps,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import React, { useState } from "react";

import { LoadingButton } from "components";

export interface DialogContentProps {
  message: string;
  buttonLeft?: string;
  buttonRight?: string;
  variant?: "warning" | "info";
}

type DeleteConfirmation = {
  content: DialogContentProps;
  open: DialogProps["open"];
  onClose: DialogProps["onClose"];
  onConfirm?: () => Promise<void>;
  DialogProps?: Omit<DialogProps, "open" | "onClose">;
};

export const DeleteConfirmation = (props: DeleteConfirmation) => {
  const [loading, setLoading] = useState(false);
  const { open, onClose, onConfirm, content, DialogProps } = props;

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (loading) {
          return;
        }
        onClose?.(e, reason);
      }}
      {...DialogProps}
      PaperProps={{
        sx: {
          maxWidth: "500px",
        },
      }}
    >
      <DialogContent>
        <DialogContentText
          sx={{
            color: content.variant === "warning" ? "primary.main" : "primary2.main",
            textAlign: "center",
            lineHeight: "24px",
          }}
        >
          {content.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "24px",
          paddingTop: 0,
        }}
      >
        <Button
          onClick={(e) => {
            if (loading) {
              return;
            }

            onClose?.(e, "escapeKeyDown");
          }}
          color={content.variant === "warning" ? "primary" : "primary2"}
          variant="outlined"
          disabled={loading}
        >
          {content.buttonLeft}
        </Button>
        <LoadingButton
          onClick={async () => {
            setLoading(true);

            await onConfirm?.();

            setLoading(false);
          }}
          color={content.variant === "warning" ? "primary" : "primary2"}
          loading={loading}
          disabled={loading}
        >
          {content.buttonRight}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
