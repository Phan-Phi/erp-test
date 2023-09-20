import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { useMountedState } from "react-use";
import { useCallback, Fragment, useMemo, useState, useEffect } from "react";

import { Button, Box } from "@mui/material";
import { get, set, cloneDeep } from "lodash";

import ViewInvoiceLineTable from "../table/ViewInvoiceLineTable";
import { LoadingButton, Dialog, BackButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { useChoice, useFetch, useNotification, usePermission } from "hooks";
import { getDisplayValueFromChoiceItem, setFilterValue, transformUrl } from "libs";

import {
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

interface ViewInvoiceLineDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
  data: any;
  onSuccessHandler: () => Promise<void>;
}

export type ViewInvoiceLineDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  invoice: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: ViewInvoiceLineDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  invoice: undefined,
  nested_depth: 4,
};

const ViewInvoiceLineDialog = ({
  open,
  toggle,
  data,
  onSuccessHandler,
}: ViewInvoiceLineDialogProps) => {
  let { hasPermission: approvePermission } = usePermission("approve_invoice");

  const invoiceId = get(data, "id");
  const status = get(data, "status");
  const isMounted = useMountedState();
  const { shipping_statuses } = useChoice();
  const { formatMessage, messages } = useIntl();
  const shipping_status = get(data, "shipping_status");
  const [openPrintNote, togglePrintNote] = useToggle(false);
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [filter, setFilter] =
    useState<ViewInvoiceLineDialogFilterType>(defaultFilterValue);

  const {
    data: dataTable,
    changeKey,
    itemCount,
    isLoading,
  } = useFetch<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
      ...filter,
      invoice: invoiceId,
    })
  );

  useEffect(() => {
    if (invoiceId) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
          ...defaultFilterValue,
          invoice: invoiceId,
        })
      );
    }
  }, [invoiceId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
            ...cloneFilter,
            invoice: invoiceId,
          })
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const onSubmit = useCallback(({ data, action }) => {
    return async () => {
      try {
        const { id, status, shipping_status } = data;

        setLoading(true);

        const invoiceId = id;

        const body = {};

        if (action === "approve") {
          if (status === "Confirmed") {
            set(body, "status", "Processed");
          } else if (status === "Processed") {
            if (shipping_status === "Pending") {
              set(body, "shipping_status", "Received");
            } else if (shipping_status === "Received") {
              set(body, "shipping_status", "On delivery");
            } else if (shipping_status === "On delivery") {
              set(body, "shipping_status", "Delivered");
            } else if (shipping_status === "Returned") {
              set(body, "shipping_status", "Received");
            }
          }
        } else if (action === "cancel") {
          set(body, "status", "Cancelled");
        } else if (action === "return") {
          set(body, "shipping_status", "Returned");
        }

        await axios.patch(`${ADMIN_ORDERS_INVOICES_END_POINT}${invoiceId}/`, body);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "đơn hàng",
          })
        );

        await onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };
  }, []);

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.line.variant.product.id");
      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

  const renderContent = useMemo(() => {
    if (!approvePermission) return null;

    if (status === "Confirmed") return null;

    if (status === "Processed") {
      let component: React.ReactNode = null;

      if (shipping_status === "Pending") {
        component = loading
          ? messages["updatingStatus"]
          : getDisplayValueFromChoiceItem(shipping_statuses, "Received");
      } else if (shipping_status === "Received") {
        component = loading
          ? messages["updatingStatus"]
          : getDisplayValueFromChoiceItem(shipping_statuses, "On delivery");
      } else if (shipping_status === "On delivery") {
        component = loading
          ? messages["updatingStatus"]
          : getDisplayValueFromChoiceItem(shipping_statuses, "Delivered");
      } else if (shipping_status === "Returned") {
        component = loading
          ? messages["updatingStatus"]
          : getDisplayValueFromChoiceItem(shipping_statuses, "Received");
      }

      if (component === null) return null;

      return (
        <LoadingButton
          onClick={onSubmit({
            data,
            action: "approve",
          })}
          loading={loading}
        >
          {component}
        </LoadingButton>
      );
    }
  }, [approvePermission, data, loading]);

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
          if (loading) return;

          toggle(false);
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },
        dialogContentTextComponent: () => {
          return (
            <Fragment>
              <ViewInvoiceLineTable
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={300}
                onGotoHandler={onGotoHandler}
              />
              <Box padding="20px" />
            </Fragment>
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
              <Button
                disabled={loading}
                variant="outlined"
                onClick={() => {
                  togglePrintNote(true);
                }}
              >
                In Phiếu Giao
              </Button>
              {approvePermission && (
                <Fragment>
                  {status === "Confirmed" && (
                    <LoadingButton
                      onClick={onSubmit({
                        data,
                        action: "cancel",
                      })}
                      loading={loading}
                      disabled={loading}
                      color="error"
                    >
                      {loading ? messages["updatingStatus"] : messages["cancelInvoice"]}
                    </LoadingButton>
                  )}

                  {status === "Processed" &&
                    ["Pending", "Received", "Returned"].includes(shipping_status) && (
                      <LoadingButton
                        onClick={onSubmit({
                          data,
                          action: "cancel",
                        })}
                        loading={loading}
                        disabled={loading}
                        color="error"
                      >
                        {loading ? messages["updatingStatus"] : messages["cancelInvoice"]}
                      </LoadingButton>
                    )}

                  {status === "Confirmed" && (
                    <LoadingButton
                      onClick={onSubmit({
                        data,
                        action: "approve",
                      })}
                      loading={loading}
                    >
                      {loading ? messages["updatingStatus"] : messages["processStatus"]}
                    </LoadingButton>
                  )}

                  {shipping_status === "On delivery" && (
                    <LoadingButton
                      onClick={onSubmit({
                        data,
                        action: "return",
                      })}
                      loading={loading}
                      disabled={loading}
                      color="error"
                    >
                      {loading ? messages["updatingStatus"] : messages["failToDeliver"]}
                    </LoadingButton>
                  )}
                </Fragment>
              )}
              {renderContent}

              <PrintNote
                {...{
                  open: openPrintNote,
                  toggle: togglePrintNote,
                  id: data.id,
                  type: "ORDER_INVOICE_SHIPPING",
                }}
              />
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default ViewInvoiceLineDialog;
