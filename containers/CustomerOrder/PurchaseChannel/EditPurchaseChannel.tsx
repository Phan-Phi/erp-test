import useSWR from "swr";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Stack, Grid } from "@mui/material";
import { useEffect, useState, useCallback } from "react";

import axios from "axios.config";
import { transformUrl } from "libs";
import { useIntl } from "react-intl";
import DynamicMessage from "messages";
import { ORDER_PURCHASE_CHANNEL } from "apis";
import { ORDERS, PURCHASE_CHANNEL } from "routes";
import { usePermission, useNotification } from "hooks";
import { ORDER_PURCHASE_CHANNEL_ITEM } from "interfaces";
import PurchaseChannelForm from "./components/PurchaseChannelForm";
import { purchaseChannelSchema, PurchaseChannelSchemaProps } from "yups";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";
import { ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT } from "__generated__/END_POINT";

const EditShipper = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE>();

  const { data: orderPurchaseChannelData, mutate: orderPurchaseChannelMutate } =
    useSWR<ORDER_PURCHASE_CHANNEL_ITEM>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        use_cache: false,
      };

      return transformUrl(`${ORDER_PURCHASE_CHANNEL}${id}`, params);
    });

  useEffect(() => {
    if (orderPurchaseChannelData == undefined) {
      return;
    }

    setDefaultValues(orderPurchaseChannelData);
  }, [orderPurchaseChannelData]);

  const onSuccessHandler = useCallback(async () => {
    await orderPurchaseChannelMutate();

    router.replace(`/${ORDERS}/${PURCHASE_CHANNEL}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent
      {...{
        defaultValues,
        onSuccessHandler,
      }}
    />
  );
};

type RootComponentProps = {
  defaultValues: ADMIN_ORDERS_PURCHASE_CHANNELS_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { hasPermission: writePermission } = usePermission("write_warehouse");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: purchaseChannelSchema(),
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: PurchaseChannelSchemaProps;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const { id } = data;

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT}${id}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "kho",
            })
          );

          onSuccessHandler();
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

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["updatePurchaseChannel"]}
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
          {writePermission && (
            <LoadingButton
              {...{
                loading: loading,
                onClick: handleSubmit((data: any) => {
                  onSubmit({ data, dirtyFields });
                }),
              }}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditShipper;
