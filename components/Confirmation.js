import { useIntl } from "react-intl";
import { Button } from "@mui/material";
import { Fragment, useState } from "react";

import Dialog from "./Dialog/Dialog";
import LoadingButton from "./Button/LoadingButton";

import { WARNING, SUCCESS } from "../constant";

const ConfirmTwoStepDialog = ({ callback, open, onClose, onClosed, type, content }) => {
  const { messages } = useIntl();
  const [loading, setLoading] = useState(false);

  let activeContent;
  let noActiveContent;

  if (type === WARNING) {
    activeContent = messages["deletingStatus"];
    noActiveContent = messages["deleteStatus"];
  } else if (type === SUCCESS) {
    activeContent = messages["approvingStatus"];
    noActiveContent = messages["approveStatus"];
  }

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) return;
          onClose(false);
          setTimeout(onClosed, 500);
        },

        DialogTitleProps: {
          children: messages["confirm"],
        },
        DialogContentTextProps: {
          children: content,
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <Button
                disabled={loading}
                onClick={() => {
                  if (loading) {
                    return;
                  }

                  onClose(false);
                  setTimeout(onClosed, 500);
                }}
              >
                {messages["backButton"]}
              </Button>

              <LoadingButton
                {...{
                  loading,
                  type: "delete",
                  color: "primary",
                  onClick: async () => {
                    setLoading(true);
                    typeof callback === "function" && (await callback());
                    setLoading(false);
                    onClose();
                    onClosed();
                  },
                  children: loading ? activeContent : noActiveContent,
                  ...(type === WARNING
                    ? {
                        type: "delete",
                        color: "error",
                      }
                    : {
                        type: "update",
                        color: "primary",
                      }),
                }}
              ></LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default ConfirmTwoStepDialog;
