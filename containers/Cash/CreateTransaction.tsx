import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";

import { CASHES } from "routes";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { usePermission, useNotification } from "hooks";
import { Card, LoadingButton, BackButton } from "components";
import { ADMIN_CASH_TRANSACTIONS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CASH_TRANSACTIONS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import {
  ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";
import TransactionForm from "./components/CreateTransactionForm";

const CreateTransaction = () => {
  const { hasPermission: writePermission } = usePermission("write_transaction");

  const isMounted = useMountedState();

  const router = useRouter();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: ADMIN_CASH_TRANSACTIONS_POST_DEFAULT_VALUE,
    resolver: ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);
      try {
        // set(data, "payment_method", get(data, "payment_method.id", null));
        // set(data, "source_id", get(data, "source_id.id"));
        // set(data, "target_id", get(data, "target_id.id"));
        // set(data, "type", get(data, "type.id"));

        if (get(data, "source_type") === "") {
          set(data, "source_type", null);
        }

        if (get(data, "target_type") === "") {
          set(data, "target_type", null);
        }

        if (get(data, "target_id")) {
          unset(data, "target_name");
        }
        await axios.post(ADMIN_CASH_TRANSACTIONS_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "transaction",
          })
        );

        router.replace(`/${CASHES}`);
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
          title={messages["createTransaction"]}
          body={
            <TransactionForm
              {...{
                control,
                getValues,
                setValue,
                watch,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
          <BackButton pathname={`/${CASHES}`} disabled={loading} />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
                disabled: loading,
                onClick: handleSubmit(
                  (data) => {
                    onSubmit({ data });
                  },
                  (err) => {}
                ),
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

export default CreateTransaction;
