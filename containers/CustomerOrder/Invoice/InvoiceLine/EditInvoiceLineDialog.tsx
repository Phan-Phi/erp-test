import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMountedState } from "react-use";
import { useState, useCallback, Fragment, useEffect, useMemo } from "react";

import { Box } from "@mui/material";
import { cloneDeep, get, isEmpty } from "lodash";

import { LoadingButton, Dialog, BackButton } from "components";
import EditInvoiceLineTable from "../table/EditInvoiceLineTable";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { checkResArr } from "libs/utils";
import { useFetch, useMutateTable, useNotification } from "hooks";
import { deleteRequest, setFilterValue, transformUrl, updateRequest } from "libs";
import { ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

interface EditInvoiceLineDialogProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
  data: any;
  onSuccessHandler: () => Promise<void>;
}

export type EditInvoiceLineDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  invoice: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: EditInvoiceLineDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  invoice: undefined,
  nested_depth: 4,
};

const EditInvoiceLineDialog = ({
  open,
  toggle,
  data,
  onSuccessHandler,
}: EditInvoiceLineDialogProps) => {
  const invoiceId = get(data, "id");
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { data: editData, updateEditRowDataHandler } = useMutateTable();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [filter, setFilter] =
    useState<EditInvoiceLineDialogFilterType>(defaultFilterValue);

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

  const onSubmit = useCallback(async () => {
    try {
      const updateData: any[] = [];
      const deleteData: any[] = [];

      Object.values(editData.current).forEach((el) => {
        let unitQuantity = el.unit_quantity;

        if (unitQuantity === "" || unitQuantity === "0") {
          deleteData.push(el.id);
        } else {
          updateData.push({ id: el.id, unit_quantity: unitQuantity });
        }
      });

      setLoading(true);

      let resList: any[] = [];

      if (!isEmpty(deleteData)) {
        const results = await deleteRequest(
          ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
          deleteData
        );

        resList = [...resList, ...results];
      }

      if (!isEmpty(updateData)) {
        const results = await updateRequest(
          ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
          updateData
        );
        resList = [...resList, ...results];
      }

      const result = checkResArr(resList);

      if (result) {
        await onSuccessHandler();

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "sản phẩm",
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
  }, []);

  const onGotoHandler = useCallback(
    (data: Row<ADMIN_ORDER_INVOICE_QUANTITY_VIEW_TYPE_V1>) => {
      const productId = get(data, "original.line.variant.product.id");

      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    },
    []
  );

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
            <Fragment>
              <EditInvoiceLineTable
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                editData={editData}
                onGotoHandler={onGotoHandler}
                updateEditRowDataHandler={updateEditRowDataHandler}
              />

              <Box padding="10px" />
            </Fragment>
          );
        },

        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
                disabled={loading}
              />
              <LoadingButton onClick={onSubmit} loading={loading} disabled={loading}>
                {loading ? messages["updatingStatus"] : messages["updateStatus"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
};

export default EditInvoiceLineDialog;
