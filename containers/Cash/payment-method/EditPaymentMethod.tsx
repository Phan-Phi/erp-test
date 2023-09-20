import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useState, useEffect, useCallback } from "react";

import get from "lodash/get";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

import {
  paymentMethodSchema,
  PaymentMethodSchemaProps,
  defaultPaymentMethodFormState,
} from "yups";
import { transformUrl } from "libs";
import { CASH_PAYMENT_METHOD } from "apis";
import { CASHES, PAYMENT_METHOD } from "routes";
import { CASH_PAYMENT_METHOD_ITEM } from "interfaces";
import { useNotification, usePermission } from "hooks";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import PaymentMethodForm from "./components/PaymentMethodForm";
import {
  ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER,
  ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_CASH_PAYMENT_METHODS_END_POINT } from "__generated__/END_POINT";

const EditPaymentMethod = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE>();
  const { data: paymentMethodData, mutate: paymentMethodMutate } =
    useSWR<CASH_PAYMENT_METHOD_ITEM>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      return transformUrl(`${ADMIN_CASH_PAYMENT_METHODS_END_POINT}${id}`, {
        use_cache: false,
      });
    });

  useEffect(() => {
    if (paymentMethodData == undefined) return;

    const data = pick(paymentMethodData, [
      ...Object.keys(defaultPaymentMethodFormState()),
      "id",
    ]) as ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE;

    setDefaultValues(data);
  }, [paymentMethodData]);

  const onSuccessHandler = useCallback(async () => {
    paymentMethodMutate();
    router.replace(`/${CASHES}/${PAYMENT_METHOD}`);
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
  defaultValues: ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { hasPermission: writePermission } = usePermission("write_payment_method");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: paymentMethodSchema(),
    resolver: ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_CASH_PAYMENT_METHODS_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      setLoading(true);

      try {
        if (!isEmpty(dirtyFields)) {
          const paymentMethodId = get(data, "id");

          const body = pick(data, Object.keys(dirtyFields));
          await axios.patch(
            `${ADMIN_CASH_PAYMENT_METHODS_END_POINT}${paymentMethodId}/`,
            body
          );

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "loại transaction",
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
          title={messages["updatePaymentMethod"]}
          body={<PaymentMethodForm control={control} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${CASHES}/${PAYMENT_METHOD}`} />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
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

export default EditPaymentMethod;
