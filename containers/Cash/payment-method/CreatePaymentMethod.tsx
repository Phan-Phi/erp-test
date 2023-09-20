import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { CASH_PAYMENT_METHOD } from "apis";

import { CASHES, PAYMENT_METHOD } from "routes";
import { PaymentMethodSchemaProps } from "yups";
import { useNotification, usePermission } from "hooks";
import { Card, BackButton, LoadingButton } from "components";
import { defaultPaymentMethodFormState, paymentMethodSchema } from "yups";
import { ADMIN_CASH_PAYMENT_METHODS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { ADMIN_CASH_PAYMENT_METHODS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreatePaymentMethod = () => {
  const { hasPermission: writePermission } = usePermission("write_payment_method");

  const { control, handleSubmit } = useForm({
    defaultValues: ADMIN_CASH_PAYMENT_METHODS_POST_DEFAULT_VALUE,
    // defaultValues: defaultPaymentMethodFormState(),
    // resolver: paymentMethodSchema(),
    resolver: ADMIN_CASH_PAYMENT_METHODS_POST_YUP_RESOLVER,
  });

  const router = useRouter();
  const { messages, formatMessage } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(async ({ data }: { data: PaymentMethodSchemaProps }) => {
    setLoading(true);

    try {
      await axios.post(ADMIN_CASH_PAYMENT_METHODS_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "loại transaction",
        })
      );

      router.replace(`/${CASHES}/${PAYMENT_METHOD}`);
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["createPaymentMethod"]}
          body={<PaymentMethodForm {...{ control }} />}
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
                  onSubmit({ data });
                }),
              }}
            >
              {loading ? messages["creatingStatus"] : messages["createStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreatePaymentMethod;
