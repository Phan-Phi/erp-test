import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { useCallback, useContext } from "react";

import { Stack } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";

import { LoadingButton, BackButton, Dialog } from "components";
import { invoiceSchema, defaultInvoiceFormState, InvoiceSchemaProps } from "yups";

import { usePermission, useChoice, useNotification } from "hooks";
import DynamicMessage from "messages";
import { InvoiceContext } from "../context";
import { ORDER_INVOICE } from "apis";
import axios from "axios.config";
import InvoiceForm from "./InvoiceForm";

interface InvoiceDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
}

const InvoiceDialog = ({ open, toggle }: InvoiceDialogProps) => {
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const choice = useChoice();
  const router = useRouter();

  const isMounted = useMountedState();

  const { messages, formatMessage } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const invoiceContext = useContext(InvoiceContext);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultInvoiceFormState(choice),
    resolver: invoiceSchema(choice),
  });

  const onSubmit = useCallback(
    async ({ data }: { data: InvoiceSchemaProps }) => {
      setLoading(true);

      const shipper = get(data, "shipper.id");

      if (shipper) {
        set(data, "shipper", shipper);
      }

      try {
        await axios.post(ORDER_INVOICE, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "hóa đơn",
          })
        );

        await invoiceContext.state.mutateInvoiceList();
        await invoiceContext.state.mutateOrderInvoiceForCancelOrder();

        toggle(false);

        reset(defaultInvoiceFormState(choice), {
          keepDirty: false,
        });
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [invoiceContext]
  );

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) {
            return;
          }

          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "50vw",
              width: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["createInvoice"],
        },
        dialogContentTextComponent: () => {
          return <InvoiceForm control={control} />;
        },

        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" justifyContent="space-between" columnGap={2}>
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              {writePermission && (
                <LoadingButton
                  onClick={handleSubmit((data) => {
                    set(data, "order", router.query.id);
                    onSubmit({
                      data,
                    });
                  })}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? messages["creatingStatus"] : messages["createStatus"]}
                </LoadingButton>
              )}
            </Stack>
          ),
        },
      }}
    />
  );
};

export default InvoiceDialog;
