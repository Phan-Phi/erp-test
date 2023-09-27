import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useState, useEffect, useCallback } from "react";

import useSWR from "swr";
import get from "lodash/get";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

import { transformUrl } from "libs";
import { CASHES, TYPE } from "routes";
import { CASH_TRANSACTION_TYPE } from "apis";
import { useNotification, usePermission } from "hooks";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import TransactionTypeForm from "./components/TransactionTypeForm";

import {
  ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER,
  ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_CASH_TRANSACTIONS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const EditTransactionType = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE>();
  const { data: transactionTypeData, mutate: transactionTypeMutate } = useSWR(() => {
    const id = router.query.id;

    if (id == undefined) return;

    return transformUrl(`${CASH_TRANSACTION_TYPE}${id}`, {
      use_cache: false,
    });
  });

  useEffect(() => {
    if (transactionTypeData == undefined) return;

    const data = pick(transactionTypeData, [
      ...Object.keys(ADMIN_CASH_TRANSACTIONS_TYPES_POST_DEFAULT_VALUE),
      "id",
    ]) as ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE;

    setDefaultValues(data);
  }, [transactionTypeData]);

  const onSuccessHandler = useCallback(async () => {
    transactionTypeMutate();
    router.replace(`/${CASHES}/${TYPE}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

const RootComponent = ({ defaultValues, onSuccessHandler }) => {
  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: transactionTypeSchema(),
    resolver: ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_RESOLVER,
  });

  const isMounted = useMountedState();

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess, loading, setLoading } =
    useNotification();

  const { messages, formatMessage } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_transaction_type");

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_CASH_TRANSACTIONS_TYPES_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const transactionTypeId = get(data, "id");

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${CASH_TRANSACTION_TYPE}${transactionTypeId}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
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
          title={messages["updateTransaction"]}
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

export default EditTransactionType;
