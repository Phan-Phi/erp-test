import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useCallback, Fragment } from "react";

import get from "lodash/get";
import { Grid } from "@mui/material";

import DynamicMessage from "messages";
import SelectWarehouse from "./SelectWarehouse";
import CreateInvoiceLineList from "./CreateInvoiceLineList";
import { LoadingButton, Dialog, BackButton } from "components";

import { checkResArr, createRequest } from "libs";
import { useMutateTable, useNotification } from "hooks";

import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

interface InvoiceLineDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
  data: ADMIN_ORDER_INVOICE_VIEW_TYPE_V1;
  onSuccessHandler: () => Promise<void>;
}

const InvoiceLineDialog = ({
  open,
  toggle,
  data,
  onSuccessHandler,
}: InvoiceLineDialogProps) => {
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { data: editData, updateEditRowDataHandler } = useMutateTable();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control: invoiceQuantityControl, watch: invoiceQuantityWatch } = useForm({
    defaultValues: ADMIN_ORDERS_INVOICES_QUANTITIES_POST_DEFAULT_VALUE,
    resolver: ADMIN_ORDERS_INVOICES_QUANTITIES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async () => {
    try {
      const filteredData = Object.values(editData.current).filter((el) => {
        let unitQuantity = get(el, "unit_quantity");

        if (unitQuantity) {
          return true;
        } else {
          return false;
        }
      });

      if (get(filteredData, "length") === 0) {
        return;
      }

      setLoading(true);

      const results = await createRequest(
        ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
        filteredData
      );

      const result = checkResArr(results);

      if (result) {
        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "hóa đơn",
          })
        );

        onSuccessHandler();
      }
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  return (
    <Dialog
      {...{
        open,
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "70vw",
              minWidth: "50vw",
            },
          },
        },

        onClose: () => {
          if (loading) {
            return;
          }

          toggle(false);
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container>
              <Grid item xs={12}>
                <SelectWarehouse control={invoiceQuantityControl} />
              </Grid>

              <Grid item xs={12}>
                {!!invoiceQuantityWatch("warehouse") && (
                  <CreateInvoiceLineList
                    {...{
                      warehouse: invoiceQuantityWatch("warehouse"),
                      invoice: data,
                      editData,
                      updateEditRowDataHandler,
                    }}
                  />
                )}
              </Grid>
            </Grid>
          );
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton onClick={onSubmit} loading={loading}>
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default InvoiceLineDialog;
