import useSWR from "swr";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";
import { useCallback, useState, useEffect, useMemo, Fragment } from "react";

import { get, pick, isEmpty } from "lodash";
import { Grid, Stack, Checkbox, FormControlLabel } from "@mui/material";

import { BackButton, LoadingButton, LoadingDynamic as Loading, Card } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { PURCHASE_ORDERS } from "routes";
import PartnerOrderProvider from "../context";
import { usePermission, useConfirmation, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_STOCK_PURCHASE_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const OrderedItemList = dynamic(() => import("./ordered-item/OrderedItemList"), {
  loading: () => {
    return <Loading />;
  },
});
const ViewPurchaseOrder = dynamic(() => import("./view/ViewPurchaseOrder"), {
  loading: () => {
    return <Loading />;
  },
});
const PurchaseOrderForm = dynamic(() => import("./components/PurchaseOrderForm"), {
  loading: () => {
    return <Loading />;
  },
});

const ReceiptOrder = dynamic(() => import("../ReceiptOrder/ReceiptOrder"), {
  loading: () => {
    return <Loading />;
  },
});
const ReturnOrder = dynamic(() => import("../ReturnOrder/ReturnOrder"), {
  loading: () => {
    return <Loading />;
  },
});

export interface PURCHASE_ORDER_TYPE_EXTENDS
  extends ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE {
  id?: number;
}

const EditPurchaseOrder = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<any>();

  const {
    data: purchaseOrderData,
    mutate: purchaseOrderMutate,
    isValidating,
  } = useSWR<ADMIN_STOCK_PURCHASE_ORDER_VIEW_TYPE_V1>(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };
    return transformUrl(`${ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT}${id}`, params);
  });

  useEffect(() => {
    if (purchaseOrderData == undefined) return;

    const data = pick(purchaseOrderData, [
      ...Object.keys(ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE),
      "id",
    ]) as any;

    setDefaultValues(data);
  }, [purchaseOrderData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultValues(undefined);

    const purchaseOrderData = await purchaseOrderMutate();

    const data = pick(purchaseOrderData, [
      ...Object.keys(ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE),
      "id",
    ]) as any;

    setDefaultValues(data);
  }, []);

  if (defaultValues == undefined && isValidating) return <Loading />;
  if (defaultValues == undefined) return <Loading />;

  return (
    <PartnerOrderProvider mutate={purchaseOrderMutate}>
      <RootComponent {...{ defaultValues, onSuccessHandler }} />
    </PartnerOrderProvider>
  );
};

type RootComponentProps = {
  defaultValues: PURCHASE_ORDER_TYPE_EXTENDS;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_purchase_order");
  const { hasPermission: approvePermission } = usePermission("approve_purchase_order");

  const router = useRouter();

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();
  const { onConfirm, onClose } = useConfirmation();

  const [approve, setApprove] = useState(false);
  const { formatMessage, messages } = useIntl();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER,
  });

  const approveHandler = useCallback((status) => {
    return async () => {
      const handler = async () => {
        try {
          setLoading(true);

          await axios.patch(
            `${ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT}${router.query.id}/`,
            {
              status,
            }
          );

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.approveSuccessfully, {
              content: "phiếu đặt hàng",
            })
          );

          onSuccessHandler();

          onClose();
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          if (isMounted()) {
            setLoading(false);
          }
        }
      };

      if (status !== "Cancelled") {
        onConfirm(handler, {
          message: messages["confirmPurchaseOrder"] as string,
          variant: "info",
        });

        return;
      }

      onConfirm(handler, {
        message: messages["confirmCancelOrder"] as string,
      });
    };
  }, []);

  const onSubmitHandler = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: PURCHASE_ORDER_TYPE_EXTENDS;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const purchaseOrderId = get(data, "id");

          const body = pick(data, [...Object.keys(dirtyFields)]);

          await axios.patch(
            `${ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT}${purchaseOrderId}/`,
            body
          );

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "phiếu đặt hàng",
            })
          );
        }
        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    []
  );

  const ControlPanelMemo = useMemo(() => {
    return (
      <Stack spacing={2}>
        <LoadingButton
          loading={loading}
          onClick={approveHandler("Cancelled")}
          color="error"
        >
          {loading ? messages["updatingStatus"] : messages["cancelPurchaseOrder"]}
        </LoadingButton>
        <LoadingButton loading={loading} onClick={approveHandler("Processed")}>
          {loading ? messages["updatingStatus"] : messages["processPurchaseOrder"]}
        </LoadingButton>
      </Stack>
    );
  }, [loading]);

  const PurchaseOrderItemMemo = useMemo(() => {
    const status = get(defaultValues, "status");

    if (status === "Draft") {
      return <OrderedItemList data={defaultValues} />;
    } else {
      return <ViewPurchaseOrder />;
    }
  }, [defaultValues]);

  const status = get(defaultValues, "status");

  return (
    <Grid container>
      {status === "Draft" && (
        <Grid item xs={12}>
          <Card
            title={messages["purchaseOrder"]}
            body={<PurchaseOrderForm control={control} defaultValues={defaultValues} />}
          />
        </Grid>
      )}

      <Grid item xs={status === "Confirmed" ? 9 : 12}>
        {PurchaseOrderItemMemo}
      </Grid>

      {status === "Confirmed" && (
        <Grid item xs={3}>
          {approvePermission && (
            <Card title={messages["controlPanel"]} body={ControlPanelMemo} />
          )}
        </Grid>
      )}

      {["Partial_fulfilled", "Fulfilled", "Processed"].includes(status) && (
        <Fragment>
          <Grid item xs={12}>
            <ReceiptOrder />
          </Grid>

          <Grid item xs={12}>
            <ReturnOrder />
          </Grid>
        </Fragment>
      )}

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${PURCHASE_ORDERS}`} />

          {status === "Processed" && writePermission && approvePermission && (
            <LoadingButton
              loading={loading}
              onClick={approveHandler("Cancelled")}
              color="error"
            >
              {loading ? messages["updatingStatus"] : messages["cancelPurchaseOrder"]}
            </LoadingButton>
          )}

          {status === "Draft" && (
            <Stack
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              columnGap={2}
            >
              {approvePermission && (
                <FormControlLabel
                  control={
                    <Checkbox
                      value={approve}
                      onChange={(e) => {
                        setApprove((prev) => {
                          return !prev;
                        });
                      }}
                    />
                  }
                  label={messages["confirmPurchaseOrder"]}
                />
              )}

              {approvePermission && approve ? (
                <LoadingButton loading={loading} onClick={approveHandler("Confirmed")}>
                  {loading ? messages["approvingStatus"] : messages["approveStatus"]}
                </LoadingButton>
              ) : (
                <LoadingButton
                  loading={loading}
                  onClick={handleSubmit((data) => {
                    onSubmitHandler({
                      data,
                      dirtyFields,
                    });
                  })}
                >
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditPurchaseOrder;

{
  /* <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" marginBottom={2}>
          <BackButton pathname={`/${PURCHASE_ORDERS}`} />

          <LoadingButton
            loading={loading}
            onClick={approveHandler(router.query.id, "Cancelled")}
            color="error"
            type="delete"
          >
            {loading
              ? messages["updatingStatus"]
              : messages["purchaseOrder.cancelPurchaseOrder"]}
          </LoadingButton>
        </Stack>
      </Grid> */
}

// const onSubmit = useCallback(async ({ data }) => {

// }, []);
