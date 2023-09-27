import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useCallback, useContext } from "react";

import { set } from "lodash";
import { Stack } from "@mui/material";

import InvoiceForm from "./InvoiceForm";
import { LoadingButton, BackButton, Dialog } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { InvoiceContext } from "../context";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_ORDERS_INVOICES_POST_YUP_RESOLVER,
  ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_INVOICES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

interface InvoiceDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
}

const InvoiceDialog = ({ open, toggle }: InvoiceDialogProps) => {
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const router = useRouter();

  const isMounted = useMountedState();

  const { messages, formatMessage } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const invoiceContext = useContext(InvoiceContext);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: ADMIN_ORDERS_INVOICES_POST_DEFAULT_VALUE,
    resolver: ADMIN_ORDERS_INVOICES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_INVOICES_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      try {
        await axios.post(ADMIN_ORDERS_INVOICES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "hóa đơn",
          })
        );

        await invoiceContext.state.mutateInvoiceList();
        await invoiceContext.state.mutateOrderInvoiceForCancelOrder();

        toggle(false);

        reset(ADMIN_ORDERS_INVOICES_POST_DEFAULT_VALUE, {
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
