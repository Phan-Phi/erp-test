import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useEffect, useState, useCallback } from "react";

import useSWR from "swr";
import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";
import isEmpty from "lodash/isEmpty";

import { transformUrl } from "libs";
import { ORDER_SHIPPING_METHOD } from "apis";
import { ORDERS, SHIPPING_METHOD } from "routes";
import { usePermission, useNotification } from "hooks";
import { Card, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";
import {
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER,
  ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";
import ShippingMethodForm from "./components/ShippingMethodForm";

const EditShippingMethod = () => {
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE>();

  const router = useRouter();

  const { data: shippingMethodData, mutate: shippingMethodMutate } = useSWR(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${ORDER_SHIPPING_METHOD}${id}`, params);
  });

  const onSuccessHandler = useCallback(async () => {
    await shippingMethodMutate();
    router.replace(`/${ORDERS}/${SHIPPING_METHOD}`);
  }, []);

  useEffect(() => {
    if (shippingMethodData == undefined) return;

    const temp: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE =
      {} as ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE;

    const normalList = ["id", "type", "name"];
    const priceObjList = ["minimum_order_price", "maximum_order_price"];
    const weightObjList = ["minimum_order_weight", "maximum_order_weight"];

    for (const key of Object.keys(shippingMethodData)) {
      if (key === "price") {
        const price = get(shippingMethodData, "price.excl_tax");
        const priceInclTax = get(shippingMethodData, "price.incl_tax");

        set(temp, "price", parseFloat(price));
        set(temp, "price_incl_tax", parseFloat(priceInclTax));

        continue;
      }

      if (normalList.includes(key)) {
        set(temp, key, shippingMethodData[key]);

        continue;
      }

      if (priceObjList.includes(key)) {
        const value = parseFloat(get(shippingMethodData, `${key}.incl_tax`) || 0);
        set(temp, key, value);
        continue;
      }

      if (weightObjList.includes(key)) {
        const value = parseFloat(get(shippingMethodData, `${key}.weight`) || 0);
        set(temp, key, value);
      }
    }

    setDefaultValues(temp);
  }, [shippingMethodData]);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent defaultValues={defaultValues} onSuccessHandler={onSuccessHandler} />
  );
};

type RootComponentProps = {
  defaultValues: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { query } = useRouter();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { hasPermission: writePermission } = usePermission("write_shipping_method");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_ORDERS_SHIPPING_METHODS_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
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

        if (!isEmpty(dirtyFields)) {
          unset(data, "id");

          await axios.put(`${ORDER_SHIPPING_METHOD}${query.id}/`, data);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "phương thức vận chuyển",
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
          title={messages["updateShippingMethod"]}
          body={
            <ShippingMethodForm
              {...{
                control,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${ORDERS}/${SHIPPING_METHOD}`} />
          {writePermission && (
            <LoadingButton
              {...{
                loading: loading,
                onClick: handleSubmit((data) => {
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

export default EditShippingMethod;
