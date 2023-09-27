import set from "lodash/set";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Stack, Grid } from "@mui/material";
import { useMountedState } from "react-use";

import { useNotification } from "hooks";
import { ORDERS, SHIPPING_METHOD } from "routes";
import { Card, BackButton, LoadingButton } from "components";
import { ADMIN_ORDERS_SHIPPING_METHODS_END_POINT } from "__generated__/END_POINT";

import axios from "axios.config";
import DynamicMessage from "messages";
import ShippingMethodForm from "./components/ShippingMethodForm";

import {
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_ORDERS_SHIPPING_METHODS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateShippingMethod = () => {
  const router = useRouter();

  const isMounted = useMountedState();

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_ORDERS_SHIPPING_METHODS_POST_DEFAULT_VALUE,
    resolver: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER,
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        for (const key of Object.keys(data)) {
          if (key.includes("price") && data[key] === "") {
            set(data, key, "0");
            continue;
          }
          if (key.includes("weight") && data[key] === "") {
            set(data, key, "0");
            continue;
          }
        }

        await axios.post(ADMIN_ORDERS_SHIPPING_METHODS_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "phương thức vận chuyển",
          })
        );

        router.replace(`/${ORDERS}/${SHIPPING_METHOD}`);
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
          title={messages["createShippingMethod"]}
          body={<ShippingMethodForm control={control} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}/${SHIPPING_METHOD}`} />

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

export default CreateShippingMethod;
