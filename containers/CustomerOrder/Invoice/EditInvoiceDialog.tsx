import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect } from "react";

import { Stack } from "@mui/material";
import { get, set, pick, isEmpty } from "lodash";

import axios from "axios.config";
import DynamicMessage from "messages";
import InvoiceForm from "./InvoiceForm";
import { useChoice, useNotification, usePermission } from "hooks";
import { Dialog, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";

import {
  ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

interface EditInvoiceDialogProps {
  open: boolean;
  toggle: (newBoolean?: boolean) => void;
  data: ADMIN_ORDER_INVOICE_VIEW_TYPE_V1;
  onSuccessHandler: () => Promise<void>;
}

export interface ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE_EXTENDS
  extends ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE {}

const EditInvoiceDialog = ({
  data,
  open,
  toggle,
  onSuccessHandler,
}: EditInvoiceDialogProps) => {
  const [defaultValues, setDefaultValues] = useState<any>();

  useEffect(() => {
    if (data == undefined) return;

    if (!open) {
      setDefaultValues(undefined);
      return;
    }

    const temp = pick(data, ["id", "status", "cod", "shipper"]) as any;

    set(temp, "surcharge", parseFloat(get(data, "surcharge.incl_tax")));
    set(temp, "shipping_incl_tax", parseFloat(get(data, "shipping_charge.incl_tax")));
    set(temp, "shipping_excl_tax", parseFloat(get(data, "shipping_charge.excl_tax")));
    set(temp, "order", get(data, "order.id"));

    setDefaultValues(temp);
  }, [data, open]);

  if (defaultValues == undefined && !open) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, open, toggle, onSuccessHandler }} />;
};

interface RootComponentProps extends Omit<EditInvoiceDialogProps, "data"> {
  defaultValues: ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE_EXTENDS;
}

const RootComponent = ({
  open,
  toggle,
  defaultValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_invoice");

  const choice = useChoice();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const { messages, formatMessage } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_ORDERS_INVOICES_WITH_ID_PATCH_YUP_SCHEMA_TYPE_EXTENDS;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const invoiceId = get(data, "id");

          const shipperId = get(data, "shipper.id");
          if (shipperId) {
            set(data, "shipper", shipperId);
          }

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_ORDERS_INVOICES_END_POINT}${invoiceId}/`, body);

          await onSuccessHandler();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "hóa đơn",
            })
          );
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [onSuccessHandler]
  );

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (loading) return;
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["updateInvoice"],
        },
        dialogContentTextComponent: () => {
          return <InvoiceForm control={control} />;
        },

        DialogActionsProps: {
          children: (
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              {writePermission && (
                <LoadingButton
                  onClick={handleSubmit((data) => {
                    onSubmit({ data, dirtyFields });
                  })}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          ),
        },
      }}
    />
  );
};

export default EditInvoiceDialog;
