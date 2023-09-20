import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Grid, Stack, Box } from "@mui/material";
import { cloneDeep, get, set, unset } from "lodash";

import { LoadingButton, Dialog, BackButton } from "components";
import { FormControl, FormControlForNumber } from "compositions";
import CreateReceiptOrderLineTable from "./table/CreateReceiptOrderLineTable";

import axios from "axios.config";
import DynamicMessage from "messages";
import { ReceiptOrderContext } from "./context";
import { useMutateTable, useNotification, useFetch } from "hooks";
import { transformUrl, createRequest, checkResArr, setFilterValue } from "libs";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_DEFAULT_VALUE,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

interface CreateReceiptOrderLineProps {
  open: boolean;
  toggle: (newValue?: boolean) => void;
}

export type CreateReceiptOrderLineFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  order: string | undefined;
};

const defaultFilterValue: CreateReceiptOrderLineFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  order: undefined,
};

const CreateReceiptOrderLine = ({ open, toggle }: CreateReceiptOrderLineProps) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();
  const receiptOrderContext = useContext(ReceiptOrderContext);

  const {
    control: receiptOrderControl,
    handleSubmit: receiptOrderHandleSubmit,
    reset: receiptOrderReset,
  } = useForm({
    defaultValues: ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_DEFAULT_VALUE,
    resolver: ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    updateEditRowDataHandler,
    resetEditRowHandler,
    activeEditRowHandler,
  } = useMutateTable();

  const [filter, setFilter] =
    useState<CreateReceiptOrderLineFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_STOCK_PURCHASE_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_LINES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
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

  const onSubmit = useCallback(
    async ({ data }) => {
      try {
        setLoading(true);

        const bodyList: any[] = [];

        const { data: resData } = await axios.post(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
          data
        );

        const receiptOrderId = get(resData, "id");

        Object.keys(editData.current).forEach((key) => {
          const data = {
            ...ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_POST_DEFAULT_VALUE,
            ...editData.current[key],
            order: receiptOrderId,
            line: key,
          };

          const quantity = get(data, "receipt_quantity");
          const expirationDate = get(data, "expiration_date");

          unset(data, "receipt_quantity");
          set(data, "quantity", quantity);
          set(data, "expiration_date", expirationDate);

          bodyList.push(data);
        });

        const results = await createRequest(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
          bodyList
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "phiếu nhập kho",
            })
          );

          resetEditRowHandler();

          await receiptOrderContext.state.mutate();

          toggle(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [receiptOrderContext]
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
          receiptOrderReset(
            ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_POST_DEFAULT_VALUE,
            {
              keepDirty: false,
            }
          );
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
          children: messages["addActualImport"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container justifyContent={"flex-start"} spacing={1}>
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
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: " ₫",
                        }}
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
                <CreateReceiptOrderLineTable
                  data={data ?? []}
                  count={itemCount}
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onFilterChangeHandler("page")}
                  onPageSizeChange={onFilterChangeHandler("pageSize")}
                  maxHeight={250}
                  updateEditRowDataHandler={updateEditRowDataHandler}
                  activeEditRowHandler={activeEditRowHandler}
                  activeEditRow={activeEditRow}
                  editData={editData}
                />
                <Box padding="20px" />
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

              <LoadingButton
                disabled={loading}
                loading={loading}
                onClick={receiptOrderHandleSubmit((data) => {
                  set(data, "order", router.query.id);

                  onSubmit({
                    data,
                  });
                })}
              >
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default CreateReceiptOrderLine;
