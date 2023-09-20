import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { Button } from "@mui/material";

import Dialog from "../Dialog";
import { LoadingButton } from "../../components";

const ConfirmTwoStepDialog = ({
  onSubmit,
  open,
  toggle,
  DialogTitleProps = {},
  DialogActionsProps = {},
  DialogContentProps = {},
  DialogContentTextProps = {},
  dialogActionsComponent,
  dialogContentTextComponent,
  LoadingButtonProps = {},
  dialogTitleComponent,
  ...otherProps
}) => {
  const { messages } = useIntl();
  const [loading, setLoading] = useState(false);

  let { activeContent, noActiveContent, ...props } = LoadingButtonProps;

  activeContent = activeContent || messages["deletingStatus"];
  noActiveContent = noActiveContent || messages["deleteStatus"];

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          toggle(false);
        },
        DialogTitleProps: {
          children: messages["confirm"],
          ...DialogTitleProps,
        },
        DialogContentTextProps: {
          children: messages["confirmDeleteContent"],
          ...DialogContentTextProps,
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <Button
                onClick={() => {
                  toggle(false);
                }}
              >
                {messages["cancel"]}
              </Button>

              <LoadingButton
                {...{
                  loading,
                  type: "delete",
                  color: "error",
                  onClick: async () => {
                    setLoading(true);

                    await onSubmit();

                    setLoading(false);
                    toggle(false);
                  },
                  children: loading ? activeContent : noActiveContent,
                  ...props,
                }}
              ></LoadingButton>
            </Fragment>
          ),
          ...DialogActionsProps,
        },
        DialogContentProps,
        dialogActionsComponent,
        dialogContentTextComponent,
        dialogTitleComponent,
        ...otherProps,
      }}
    />
  );
};

export default ConfirmTwoStepDialog;
