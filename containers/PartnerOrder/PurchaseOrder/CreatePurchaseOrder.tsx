import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { get } from "lodash";
import { Grid, Stack } from "@mui/material";

import { LoadingButton, BackButton, Card } from "components";
import PurchaseOrderForm from "./components/PurchaseOrderForm";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { PURCHASE_ORDERS, EDIT } from "routes";

import {
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreatePurchaseOrder = () => {
  const router = useRouter();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_DEFAULT_VALUE,
    resolver: ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_WAREHOUSES_PURCHASE_ORDERS_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        // let warehouseId = get(data, "warehouse.id");
        // let partnerId = get(data, "partner.id");

        // set(data, "warehouse", warehouseId);
        // set(data, "partner", partnerId);

        const { data: resData } = await axios.post(
          ADMIN_WAREHOUSES_PURCHASE_ORDERS_END_POINT,
          data
        );

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "phiếu đặt hàng",
          })
        );

        const purchaseOrderId = get(resData, "id");

        const pathname = `/${PURCHASE_ORDERS}/${EDIT}/${purchaseOrderId}`;

        router.replace(pathname, pathname, {
          shallow: true,
        });
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

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["createPurchaseOrder"]}
          body={<PurchaseOrderForm {...{ control }} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PURCHASE_ORDERS}`} />

          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreatePurchaseOrder;
