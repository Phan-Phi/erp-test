import { useIntl } from "react-intl";
import { useForm, Controller } from "react-hook-form";
import { useState, useCallback, useEffect, useMemo } from "react";

import { Grid, Stack, Box } from "@mui/material";
import { get, set, pick, unset, isEmpty, cloneDeep } from "lodash";

import EditReturnOrderLineTable from "./table/EditReturnOrderLineTable";
import { FormControlBase, FormControlForNumber, FormControl } from "compositions";
import { LoadingButton, Dialog, BackButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { updateRequest, transformUrl, checkResArr, setFilterValue } from "libs";
import { useFetch, usePermission, useMutateTable, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

interface EditReturnOrderDialogProps {
  open: boolean;
  data?: any;
  toggle: (nextValue?: any) => void;
  onSuccessHandler: () => Promise<void>;
}

interface RETURN_ORDER_EXTENDS
  extends ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE {}

export type EditReturnOrderDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  order: number | undefined;
};

const defaultFilterValue: EditReturnOrderDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 4,
  order: undefined,
};

const EditReturnOrderDialog = ({
  data,
  open,
  toggle,
  onSuccessHandler,
}: EditReturnOrderDialogProps) => {
  const [defaultValues, setDefaultValues] = useState<RETURN_ORDER_EXTENDS>();

  useEffect(() => {
    if (data == undefined) return;

    if (!open) {
      setDefaultValues(undefined);
      return;
    }

    const temp = pick(data, ["id", "status", "notes"]) as RETURN_ORDER_EXTENDS;
    const receiptOrderId = get(data, "order.sid");

    set(temp, "surcharge", parseFloat(get(data, "surcharge.incl_tax")).toString());
    set(temp, "order", get(data, "order.id").toString());

    set(temp, "receiptOrderId", receiptOrderId);

    setDefaultValues(temp);
  }, [data, open]);

  if (!open || data == undefined) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, open, toggle, onSuccessHandler }} />;
};

interface RootComponent extends Omit<EditReturnOrderDialogProps, "data"> {
  defaultValues: RETURN_ORDER_EXTENDS;
}

const RootComponent = ({
  defaultValues,
  open,
  toggle,
  onSuccessHandler,
}: RootComponent) => {
  const { hasPermission: writePermission } = usePermission("write_return_order");

  const orderId = get(defaultValues, "id");

  const { formatMessage, messages } = useIntl();
  const [editLoading, setEditLoading] = useState(false);
  const { data: editData, updateEditRowDataHandler } = useMutateTable();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();
  const [filter, setFilter] =
    useState<EditReturnOrderDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_RETURN_ORDER_VIEW_TYPE_V1>(
      transformUrl(
        ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
        {
          ...filter,
          order: orderId,
        }
      )
    );

  useEffect(() => {
    if (orderId) {
      changeKey(
        transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
          {
            ...defaultFilterValue,
            order: orderId,
          }
        )
      );
    }
  }, [orderId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
            {
              ...cloneFilter,
              order: orderId,
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

  const {
    control: returnOrderControl,
    handleSubmit: returnOrderHandleSubmit,
    formState: { dirtyFields: returnOrderDirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: RETURN_ORDER_EXTENDS;
      dirtyFields: object;
    }) => {
      try {
        let resList: any[] = [];

        setEditLoading(true);

        if (!isEmpty(dirtyFields)) {
          const returnOrderId = get(data, "id");

          const body = pick(data, ["surcharge", "notes"]);
          await axios.patch(
            `${ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT}${returnOrderId}/`,
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

            const quantity = get(data, "return_quantity");

            if (quantity) {
              unset(data, "return_quantity");
              set(data, "quantity", quantity);
            }

            bodyList.push(data);
          });

          const results = await updateRequest(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
            bodyList
          );

          resList = [...resList, ...results];
        }

        const result = checkResArr(resList);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "phiếu trả kho",
            })
          );

          refreshData();

          onSuccessHandler();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        setEditLoading(false);
      }
    },
    [onSuccessHandler]
  );

  const status = get(defaultValues, "status");

  return (
    <Dialog
      {...{
        open,
        onClose: () => {
          if (editLoading) {
            return;
          }

          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "75vw",
              minWidth: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["updateActualExportForReturn"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container spacing={1} justifyContent="flex-start">
              <Grid item xs={6}>
                <FormControlBase
                  FormLabelProps={{ children: messages["receiptOrder"] as string }}
                  InputProps={{
                    readOnly: true,
                    value: get(defaultValues, "receiptOrderId"),
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="surcharge"
                  control={returnOrderControl}
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["surcharge"] as string}
                        placeholder={messages["surcharge"] as string}
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: " ₫",
                        }}
                        readOnly={(status !== "Draft" ? true : false) || !writePermission}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={returnOrderControl}
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["note"] as string}
                        placeholder={messages["note"] as string}
                        InputProps={{
                          multiline: true,
                          rows: 2,
                          readOnly:
                            (status !== "Draft" ? true : false) || !writePermission,
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
                <EditReturnOrderLineTable
                  data={data ?? []}
                  count={itemCount}
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight={250}
                  orderStatus={status}
                  writePermission={writePermission}
                  editData={editData}
                  updateEditRowDataHandler={updateEditRowDataHandler}
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
                disabled={editLoading}
                onClick={() => {
                  toggle(false);
                }}
              />
              {writePermission && status === "Draft" && (
                <LoadingButton
                  loading={editLoading}
                  onClick={returnOrderHandleSubmit((data) => {
                    onSubmit({
                      data,
                      dirtyFields: returnOrderDirtyFields,
                    });
                  })}
                >
                  {editLoading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          ),
        },
      }}
    />
  );
};

export default EditReturnOrderDialog;
