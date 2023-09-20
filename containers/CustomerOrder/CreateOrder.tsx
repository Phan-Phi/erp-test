import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { get, unset } from "lodash";
import { Grid, Stack } from "@mui/material";

import OrderForm from "./OrderForm";
import { Card, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { ORDERS, EDIT } from "routes";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_ORDERS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateShippingMethod = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_order");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch, setValue, clearErrors } = useForm({
    defaultValues: ADMIN_ORDERS_POST_DEFAULT_VALUE,
    resolver: ADMIN_ORDERS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      let receiverId = get(data, "receiver");

      if (receiverId) {
        unset(data, "receiver_name");
        unset(data, "receiver_email");
        unset(data, "receiver_phone_number");
      }

      try {
        const { data: resData } = await axios.post(ADMIN_ORDERS_END_POINT, data);

        const orderId = get(resData, "id");

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "đơn hàng",
          })
        );

        const pathname = `/${ORDERS}/${EDIT}/${orderId}`;
        router.replace(pathname, pathname, { shallow: true });
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
      <Grid item xs={10}>
        <Card
          title={messages["createOrder"]}
          body={
            <OrderForm
              {...{
                control,
                watch,
                setValue,
                clearErrors,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}`} disabled={loading} />
          {writePermission && (
            <Stack flexDirection="row">
              <LoadingButton
                loading={loading}
                onClick={handleSubmit((data) => {
                  onSubmit({ data });
                })}
              >
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateShippingMethod;
