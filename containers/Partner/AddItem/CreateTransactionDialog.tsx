import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useEffect, useCallback } from "react";

import useSWR from "swr";
import { Stack } from "@mui/material";
import { get, set, unset } from "lodash";

import TransactionForm from "./TransactionForm";
import { Dialog, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { useNotification } from "hooks";

import {
  ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_END_POINT,
} from "__generated__/END_POINT";

const OBJ_DEFAULT_VALUE = {
  source_id: null,
  target_id: null,
  affect_creditor: false,
  type: null,
  payment_method: null,
  status: "Draft",
  source_type: "stock.receiptorder",
  target_type: "partner.partner",
  flow_type: "Cash_out",
  notes: "",
  address: "",
  amount: "",
  target_name: "",
};

const CreateTransactionDialog = ({ open, toggle }) => {
  const router = useRouter();

  const { data: partnerData } = useSWR(() => {
    return transformUrl(`${ADMIN_PARTNERS_END_POINT}${router.query.id}`);
  });

  const [defaultValues, setDefaultValues] =
    useState<ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE>();

  useEffect(() => {
    if (partnerData == undefined || !open) return;

    const data = OBJ_DEFAULT_VALUE;

    set(data, "source_type", "stock.receiptorder");
    set(data, "target_type", "partner.partner");
    set(data, "target_id", partnerData);
    set(data, "affect_creditor", true);
    set(data, "target_name", get(partnerData, "name"));
    set(data, "address", get(partnerData, "primary_address.line1"));

    setDefaultValues(data);
  }, [partnerData, open]);

  const onSuccessHandler = useCallback(() => {
    toggle(false);
  }, []);

  useEffect(() => {
    !open && setDefaultValues(undefined);
  }, [open]);

  if (defaultValues == undefined && !open) return null;

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent
      {...{
        defaultValues,
        open,
        toggle,
        onSuccessHandler,
      }}
    />
  );
};

type RootComponentProps = {
  open: boolean;
  toggle: any;
  onSuccessHandler: any;
  defaultValues: ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE;
};

const RootComponent = ({
  open,
  toggle,
  defaultValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues,
    resolver: ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

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
            content: "giao dịch",
          })
        );
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
    <Dialog
      {...{
        open,
        onClose: () => {
          toggle(false);
        },
        DialogProps: {
          PaperProps: {
            sx: {
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["createTransaction"],
        },
        dialogContentTextComponent: () => {
          return (
            <TransactionForm
              {...{ control, defaultValues, getValues, setValue, watch }}
            />
          );
        },

        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
              />

              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={handleSubmit((data) => {
                  onSubmit({ data });
                })}
              >
                {loading["complete"]
                  ? messages["creatingStatus"]
                  : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default CreateTransactionDialog;
