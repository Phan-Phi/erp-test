import { useIntl } from "react-intl";
import { useForm, Controller } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect, useMemo } from "react";

import formatISO from "date-fns/formatISO";
import { Grid, Stack, Box } from "@mui/material";
import { get, set, unset, isEmpty, pick, cloneDeep } from "lodash";

import { FormControlForNumber, FormControl } from "compositions";
import EditReceiptOrderLineTable from "./table/EditReceiptOrderLineTable";
import { LoadingButton, Dialog, LoadingDynamic as Loading, BackButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useFetch, usePermission, useMutateTable, useNotification } from "hooks";
import { updateRequest, checkResArr, transformUrl, setFilterValue } from "libs";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type EditReceiptOrderDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: EditReceiptOrderDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 3,
  order: undefined,
};

interface EditReceiptOrderDialogProps {
  open: boolean;
  toggle: (nextValue?: boolean) => void;
  data: any | null;
  onSuccessHandler: () => Promise<void>;
}

interface DEFAULT_VALUE_RECEIPT_ORDER_EXTENDS
  extends ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE {
  id?: number;
}

const EditReceiptOrderDialog = ({
  data,
  open,
  toggle,
  onSuccessHandler,
}: EditReceiptOrderDialogProps) => {
  const [defaultValues, setDefaultValues] =
    useState<DEFAULT_VALUE_RECEIPT_ORDER_EXTENDS>();

  useEffect(() => {
    if (data == undefined) return;

    if (!open) {
      setDefaultValues(undefined);

      return;
    }
    const temp = pick(data, [
      "id",
      "status",
      "notes",
    ]) as DEFAULT_VALUE_RECEIPT_ORDER_EXTENDS;

    set(temp, "surcharge", parseFloat(get(data, "surcharge.incl_tax")));
    set(temp, "order", get(data, "order.id"));

    setDefaultValues(temp);
  }, [data, open]);

  if (!open || data == undefined) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, open, toggle, onSuccessHandler }} />;
};

interface RootComponent extends Omit<EditReceiptOrderDialogProps, "data"> {
  defaultValues: DEFAULT_VALUE_RECEIPT_ORDER_EXTENDS;
}

const RootComponent = ({
  defaultValues,
  open,
  toggle,
  onSuccessHandler,
}: RootComponent) => {
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_receipt_order");
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control: receiptOrderControl,
    handleSubmit: receiptOrderHandleSubmit,
    formState: { dirtyFields: receiptOrderDirtyFields },
  } = useForm({
    defaultValues,
    resolver:
      ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    updateEditRowDataHandler,
    resetEditRowHandler,
    activeEditRowHandler,
    activeEditRow,
  } = useMutateTable();

  const [filter, setFilter] =
    useState<EditReceiptOrderDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT, {
        ...filter,
        order: defaultValues.id,
      })
    );

  useEffect(() => {
    if (defaultValues.id) {
      changeKey(
        transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
          {
            ...defaultFilterValue,
            order: defaultValues.id,
          }
        )
      );
    }
  }, [defaultValues.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
            {
              ...cloneFilter,
              order: defaultValues.id,
            }
          )
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

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: DEFAULT_VALUE_RECEIPT_ORDER_EXTENDS;
      dirtyFields: object;
    }) => {
      try {
        const receiptOrderId = get(data, "id");

        let resList: any[] = [];

        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const body = pick(data, ["surcharge", "notes"]);
          await axios.patch(
            `${ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT}${receiptOrderId}/`,
            body
          );
        }

        if (!isEmpty(editData.current)) {
          const bodyList: any[] = [];

          Object.keys(editData.current).forEach((key) => {
            const data = {
              id: key,
              ...editData.current[key],
            };

            let quantity = get(data, "receipt_quantity");

            if (typeof quantity === "number") {
              quantity = quantity.toString();
            }

            const expirationDate = get(data, "expiration_date");

            if (quantity) {
              unset(data, "receipt_quantity");
              set(data, "quantity", quantity);
            }

            if (expirationDate) {
              set(data, "expiration_date", formatISO(expirationDate));
            }

            bodyList.push(data);
          });

          const results = await updateRequest(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
            bodyList
          );

          resList = [...resList, ...results];
        }

        const result = checkResArr(resList);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "phiếu nhập kho",
            })
          );

          refreshData();

          onSuccessHandler();
          resetEditRowHandler();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const status = get(defaultValues, "status");

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
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["updateActualImport"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container justifyContent="flex-start" spacing={1}>
              <Grid item xs={6}>
                <Controller
                  name="surcharge"
                  control={receiptOrderControl}
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["surcharge"] as string}
                        placeholder={messages["surcharge"] as string}
                        readOnly={!writePermission || (status === "Draft" ? false : true)}
                        NumberFormatProps={{ allowNegative: false, suffix: " ₫" }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={receiptOrderControl}
                  name="notes"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["note"] as string}
                        placeholder={messages["note"] as string}
                        InputProps={{
                          readOnly:
                            !writePermission || (status === "Draft" ? false : true),
                          multiline: true,
                          rows: 2,
                          sx: {
                            padding: 1,
                          },
                        }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <EditReceiptOrderLineTable
                  data={data ?? []}
                  count={itemCount}
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight={250}
                  orderStatus={status}
                  editData={editData}
                  updateEditRowDataHandler={updateEditRowDataHandler}
                  writePermission={writePermission}
                  activeEditRowHandler={activeEditRowHandler}
                  activeEditRow={activeEditRow}
                />

                <Box padding="10px" />
              </Grid>
            </Grid>
          );
        },

        DialogActionsProps: {
          children: (
            <Stack columnGap={2} flexDirection="row" justifyContent="flex-end">
              <BackButton
                disabled={loading}
                onClick={() => {
                  toggle(false);
                }}
              />

              {writePermission && get(defaultValues, "status") === "Draft" && (
                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  onClick={receiptOrderHandleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyFields: receiptOrderDirtyFields,
                    });
                  })}
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

export default EditReceiptOrderDialog;
