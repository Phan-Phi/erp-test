import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useCallback, useState } from "react";

import { Grid, Stack } from "@mui/material";

import ShipperForm from "./components/ShipperForm";
import { Card, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { ORDERS, SHIPPER } from "routes";
import { useNotification } from "hooks";

import {
  ADMIN_ORDERS_SHIPPERS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_ORDERS_SHIPPERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { ADMIN_ORDERS_SHIPPERS_END_POINT } from "__generated__/END_POINT";

const CreateShipper = () => {
  const router = useRouter();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [loading, setLoading] = useState(false);
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_ORDERS_SHIPPERS_POST_DEFAULT_VALUE,
    resolver: ADMIN_ORDERS_SHIPPERS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_SHIPPERS_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        await axios.post(ADMIN_ORDERS_SHIPPERS_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "shipper",
          })
        );

        router.replace(`/${ORDERS}/${SHIPPER}/`);
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
          title={messages["createShipper"]}
          body={<ShipperForm control={control} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}/${SHIPPER}`} />

          <LoadingButton
            loading={loading}
            onClick={() => {
              handleSubmit((data) => {
                onSubmit({ data });
              })();
            }}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateShipper;
