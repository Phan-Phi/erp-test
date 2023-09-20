import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useEffect, useState, useCallback } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import useSWR from "swr";
import { Grid, Stack } from "@mui/material";
import { get, pick, isEmpty } from "lodash";

import ShipperForm from "./components/ShipperForm";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { ORDERS, SHIPPER } from "routes";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_ORDERS_SHIPPERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const EditShipper = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<any>();

  const { data: shipperData, mutate: shipperMutate } =
    useSWR<ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        use_cache: false,
      };

      return transformUrl(`${ADMIN_ORDERS_SHIPPERS_END_POINT}${id}`, params);
    });

  useEffect(() => {
    if (shipperData == undefined) {
      return;
    }

    setDefaultValues(shipperData);
  }, [shipperData]);

  const onSuccessHandler = useCallback(async () => {
    shipperMutate();

    router.replace(`/${ORDERS}/${SHIPPER}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

type RootComponentProps = {
  defaultValues: ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const isMounted = useMountedState();
  const [loading, setLoading] = useState(false);
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_shipper");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_ORDERS_SHIPPERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      setLoading(true);

      try {
        if (!isEmpty(dirtyFields)) {
          const shipperId = get(data, "id");

          let body: any = {};

          body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_ORDERS_SHIPPERS_END_POINT}${shipperId}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "shipper",
            })
          );
        }

        onSuccessHandler();
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
          title={messages["updateShipper"]}
          body={<ShipperForm control={control} />}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}/${SHIPPER}`} />

          {writePermission && (
            <LoadingButton
              loading={loading}
              onClick={() => {
                handleSubmit((data) => {
                  onSubmit({ data, dirtyFields });
                })();
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
