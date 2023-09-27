import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Stack, Grid } from "@mui/material";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { ORDERS, PURCHASE_CHANNEL } from "routes";
import { Card, BackButton, LoadingButton } from "components";
import PurchaseChannelForm from "./components/PurchaseChannelForm";

import {
  ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateShipper = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const { formatMessage, messages } = useIntl();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_ORDERS_PURCHASE_CHANNELS_POST_DEFAULT_VALUE,
    // resolver: purchaseChannelSchema(),
    resolver: ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      try {
        await axios.post(ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "kênh bán",
          })
        );

        router.replace(`/${ORDERS}/${PURCHASE_CHANNEL}`);
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
          title={messages["createPurchaseChannel"]}
          body={
            <PurchaseChannelForm
              {...{
                control,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}/${PURCHASE_CHANNEL}`} />

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

export default CreateShipper;
