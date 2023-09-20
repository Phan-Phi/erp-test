import { useIntl } from "react-intl";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";

import {
  transactionTypeSchema,
  TransactionTypSchemaProps,
  defaultTransactionTypeFormState,
} from "yups";
import { CASHES, TYPE } from "routes";
import { CASH_TRANSACTION_TYPE } from "apis";
import { usePermission, useNotification } from "hooks";
import { Card, BackButton, LoadingButton } from "components";
import { ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT } from "__generated__/END_POINT";

import axios from "axios.config";
import DynamicMessage from "messages";
import TransactionTypeForm from "./components/TransactionTypeForm";
import { ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

const CreateType = () => {
  const { hasPermission: writePermission } = usePermission("write_transaction_type");
  const { messages, formatMessage } = useIntl();
  const router = useRouter();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues: defaultTransactionTypeFormState(),
    // resolver: transactionTypeSchema(),
    resolver: ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data }: { data: TransactionTypSchemaProps }) => {
    setLoading(true);

    try {
      await axios.post(ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "loại transaction",
        })
      );

      router.replace(`/${CASHES}/${TYPE}`);
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
          title={messages["createTransactionType"]}
          body={<TransactionTypeForm control={control} />}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${CASHES}/${TYPE}`} />

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

export default CreateType;
