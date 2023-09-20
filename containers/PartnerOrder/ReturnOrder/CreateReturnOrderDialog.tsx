import { useIntl } from "react-intl";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useMemo, Fragment, useContext, useState, useEffect } from "react";

import { Grid, Stack, Box } from "@mui/material";
import { get, set, unset, cloneDeep } from "lodash";

import SelectReceiptOrder from "./SelectReceiptOrder";
import { Dialog, LoadingButton, BackButton } from "components";
import { FormControl, FormControlForNumber } from "compositions";
import CreateReturnOrderLineTable from "./table/CreateReturnOrderLineTable";

import axios from "axios.config";
import DynamicMessage from "messages";
import { checkResArr } from "libs/utils";
import { ReturnOrderContext } from "./context";
import { transformUrl, createRequest, setFilterValue } from "libs";
import { useChoice, useFetch, useMutateTable, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_DEFAULT_VALUE,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

export type ReturnOrderDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  order: string | number | undefined;
};

const defaultFilterValue: ReturnOrderDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 3,
  order: undefined,
};

const ReturnOrderDialog = ({ open, toggle }) => {
  const choice = useChoice();
  const isMouted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const returnOrderContext = useContext(ReturnOrderContext);
  const { data: editData, updateEditRowDataHandler } = useMutateTable();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const {
    watch: returnOrderWatch,
    control: returnOrderControl,
    handleSubmit: returnOrderHandleSubmit,
  } = useForm({
    defaultValues:
      ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_DEFAULT_VALUE,
    resolver:
      ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_POST_YUP_RESOLVER,
  });

  const [filter, setFilter] = useState<ReturnOrderDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_STOCK_RECEIPT_ORDER_QUANTITY_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT, {
        ...filter,
        order: returnOrderWatch("order"),
      })
    );

  useEffect(() => {
    if (returnOrderWatch("order")) {
      changeKey(
        transformUrl(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_QUANTITIES_END_POINT,
          {
            ...defaultFilterValue,
            order: returnOrderWatch("order"),
          }
        )
      );
    }
  }, [returnOrderWatch("order")]);

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
              order: returnOrderWatch("order"),
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
    async ({ data }) => {
      try {
        setLoading(true);
        const { data: resData } = await axios.post(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_END_POINT,
          data
        );

        const returnOrderId = get(resData, "id");

        const bodyList: any[] = [];

        Object.keys(editData.current).forEach((key) => {
          const data = {
            ...ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_POST_DEFAULT_VALUE,
            ...editData.current[key],
            order: returnOrderId,
            line: key,
          };

          const quantity = get(data, "return_quantity");
          const receiptOrderQuantity = get(data, "line");

          unset(data, "return_quantity");
          unset(data, "line");

          set(data, "quantity", quantity);
          set(data, "receipt_order_quantity", receiptOrderQuantity);

          bodyList.push(data);
        });

        const results = await createRequest(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_RETURN_ORDERS_QUANTITIES_END_POINT,
          bodyList
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "phiếu trả kho",
            })
          );
          await returnOrderContext.state.mutate();

          toggle(false);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMouted()) {
          setLoading(false);
        }
      }
    },
    [returnOrderContext]
  );

  const renderFormField = useMemo(() => {
    const receiptOrderId = returnOrderWatch("order");

    return (
      <Fragment>
        <Grid item xs={6}>
          <SelectReceiptOrder control={returnOrderControl} />
        </Grid>

        {!!receiptOrderId && (
          <Fragment>
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
                        sx: {
                          padding: 1,
                        },
                      }}
                    />
                  );
                }}
              />
            </Grid>
          </Fragment>
        )}
      </Fragment>
    );
  }, [returnOrderWatch("order")]);

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
              maxWidth: "75vw",
              minWidth: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["addActualExportForReturn"],
        },
        dialogContentTextComponent: () => {
          return (
            <Grid container justifyContent="flex-start" spacing={1}>
              {renderFormField}

              <Grid item xs={12}>
                {returnOrderWatch("order") && (
                  <CreateReturnOrderLineTable
                    data={data ?? []}
                    count={itemCount}
                    pagination={pagination}
                    isLoading={isLoading}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                    editData={editData}
                    updateEditRowDataHandler={updateEditRowDataHandler}
                  />
                )}

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
                onClick={returnOrderHandleSubmit((data) => {
                  onSubmit({ data });
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

export default ReturnOrderDialog;
