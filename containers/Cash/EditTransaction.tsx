import useSWR from "swr";
import get from "lodash/get";
import set from "lodash/set";
import pick from "lodash/pick";
import unset from "lodash/unset";
import dynamic from "next/dynamic";
import isEmpty from "lodash/isEmpty";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useToggle, useMountedState } from "react-use";
import { useState, useEffect, useCallback } from "react";
import { Grid, Stack, Typography, Button } from "@mui/material";

import {
  transactionSchema,
  TransactionSchemaProps,
  defaultTransactionFormState,
} from "yups";
import { CASHES } from "routes";
import { transformUrl } from "libs";
import { CASH_TRANSACTION } from "apis";
import { CASH_TRANSACTION_ITEM } from "interfaces";
import { useChoice, useNotification, usePermission } from "hooks";
import { Card, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import ViewOnlyTransaction from "./ViewOnlyTransaction";
import TransactionForm from "./components/EditTransactionForm";
import { ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_CASH_TRANSACTIONS_END_POINT } from "__generated__/END_POINT";

const PrintNote = dynamic(import("components/PrintNote/PrintNote"), {
  loading: () => {
    return <Loading />;
  },
});

const CreateType = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<TransactionSchemaProps>();

  const { data: transactionData, mutate: transactionMutate } =
    useSWR<CASH_TRANSACTION_ITEM>(() => {
      const id = router.query.id;
      if (id) {
        const params = {
          use_cache: false,
          nested_depth: 3,
        };

        return transformUrl(`${ADMIN_CASH_TRANSACTIONS_END_POINT}${id}`, params);
      }
    });

  useEffect(() => {
    if (transactionData == undefined) return;

    const data = {} as TransactionSchemaProps;

    const keyList = [
      ...Object.keys(defaultTransactionFormState()),
      "id",
      "target",
      "source",
    ];

    keyList.forEach((key) => {
      set(data, key, transactionData[key]);
    });

    set(data, "amount", parseFloat(get(data, "amount.incl_tax")).toString());
    set(data, "target_id", get(data, "target"));
    set(data, "source_id", get(data, "source"));

    unset(data, "target");
    unset(data, "source");

    setDefaultValues(data);
  }, [transactionData]);

  const onSuccessHandler = useCallback(async () => {
    await transactionMutate();

    router.replace(`/${CASHES}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  if (get(defaultValues, "status") === "Confirmed") {
    return <ViewOnlyTransaction data={defaultValues} />;
  }

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

const RootComponent = ({ defaultValues, onSuccessHandler }) => {
  const choice = useChoice();
  const router = useRouter();
  const isMounted = useMountedState();

  const { messages, formatMessage } = useIntl();
  const [openPrintNote, togglePrintNote] = useToggle(false);

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { hasPermission: writePermission } = usePermission("write_transaction");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: transactionSchema(choice),
    resolver: ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data, dirtyFields }) => {
    console.log(
      "🚀 ~ file: EditTransaction.tsx:126 ~ onSubmit ~ dirtyFields:",
      dirtyFields
    );
    setLoading(true);

    try {
      const transactionId = get(data, "id");

      set(data, "payment_method", get(data, "payment_method.id", null));
      set(data, "source_id", get(data, "source_id.id"));
      set(data, "target_id", get(data, "target_id.id"));
      set(data, "type", get(data, "type.id"));

      if (get(data, "source_type") === "") {
        set(data, "source_type", null);
      }

      if (get(data, "target_type") === "") {
        set(data, "target_type", null);
      }

      if (get(data, "target_id")) {
        unset(data, "target_name");
      }

      if (!isEmpty(dirtyFields)) {
        const body = pick(data, Object.keys(dirtyFields));

        await axios.patch(`${ADMIN_CASH_TRANSACTIONS_END_POINT}${transactionId}/`, body);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "transaction",
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
  }, []);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          cardTitleComponent={() => {
            return (
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={700}>{messages["updateTransaction"]}</Typography>

                <Stack flexDirection="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      togglePrintNote(true);
                    }}
                  >
                    {messages["printNote"]}
                  </Button>
                </Stack>
              </Stack>
            );
          }}
          body={
            <TransactionForm
              {...{ control, getValues, setValue, watch, defaultValues }}
            />
          }
        />
      </Grid>
      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${CASHES}`} disabled={loading} />
          {writePermission && (
            <LoadingButton
              {...{
                loading,
                onClick: handleSubmit(
                  (data) => {
                    onSubmit({ data, dirtyFields });
                  },
                  (err) => {
                    // console.log("err", err);
                  }
                ),
              }}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>

      {openPrintNote && (
        <PrintNote
          {...{
            open: openPrintNote,
            toggle: togglePrintNote,
            id: router.query.id as string,
            type: "TRANSACTION",
          }}
        />
      )}
    </Grid>
  );
};

export default CreateType;
