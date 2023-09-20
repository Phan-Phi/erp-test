import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
  DialogTitleProps,
  DialogContentProps,
  DialogActionsProps,
  DialogContentTextProps,
  styled,
} from "@mui/material";
import { useMemo } from "react";

interface ExtendDialogProps {
  open: DialogProps["open"];
  onClose?: DialogProps["onClose"];
  DialogProps?: Omit<DialogProps, "open" | "onClose">;
  DialogTitleProps?: DialogTitleProps;
  DialogContentProps?: DialogContentProps;
  DialogActionsProps?: DialogActionsProps;
  DialogContentTextProps?: DialogContentTextProps;
  renderDialogContentText?: () => React.ReactNode;
  renderDialogActions?: () => React.ReactNode;
  renderDialogTitle?: () => React.ReactNode;
  dialogContentTextComponent?: () => React.ReactNode;
  dialogActionsComponent?: () => React.ReactNode;
  dialogTitleComponent?: () => React.ReactNode;
}

const Dialog = (props: ExtendDialogProps) => {
  let {
    open,
    onClose,
    DialogProps,
    DialogTitleProps,
    dialogTitleComponent,
    DialogContentTextProps,
    dialogContentTextComponent,
    DialogActionsProps,
    dialogActionsComponent,
    DialogContentProps,
    renderDialogActions,
    renderDialogContentText,
    renderDialogTitle,
  } = props;

  const renderTitle = useMemo(() => {
    let result: React.ReactNode = <DialogTitle {...DialogTitleProps} />;

    if (renderDialogTitle && typeof renderDialogTitle === "function") {
      result = renderDialogTitle();
    }

    if (dialogTitleComponent && typeof dialogTitleComponent === "function") {
      result = dialogTitleComponent();
    }

    return result;
  }, [DialogTitleProps, renderDialogTitle, dialogTitleComponent]);

  const renderContentText = useMemo(() => {
    let result: React.ReactNode = <DialogContentText {...DialogContentTextProps} />;

    if (renderDialogContentText && typeof renderDialogContentText === "function") {
      result = renderDialogContentText();
    }

    if (dialogContentTextComponent && typeof dialogContentTextComponent === "function") {
      result = dialogContentTextComponent();
    }

    return result;
  }, [DialogContentTextProps, dialogContentTextComponent, renderDialogContentText]);

  const renderAction = useMemo(() => {
    let result: React.ReactNode = <StyledDialogActions {...DialogActionsProps} />;

    if (renderDialogActions && typeof renderDialogActions === "function") {
      result = renderDialogActions();
    }

    if (dialogActionsComponent && typeof dialogActionsComponent === "function") {
      result = dialogActionsComponent();
    }

    return result;
  }, [DialogActionsProps, dialogActionsComponent, renderDialogActions]);

  return (
    <StyledMuiDialog open={!!open} onClose={onClose} {...DialogProps}>
      {renderTitle}
      <StyledDialogContent {...DialogContentProps}>
        {renderContentText}
      </StyledDialogContent>
      {renderAction}
      {dialogActionsComponent}
    </StyledMuiDialog>
  );
};

const StyledMuiDialog = styled(MuiDialog)(({ theme }) => {
  return {};
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => {
  return {
    paddingBottom: 0,
    marginBottom: 24,
  };
});

const StyledDialogActions = styled(DialogActions)(({ theme }) => {
  return {
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 0,
  };
});

export default Dialog;
