import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useEffect, useCallback } from "react";

import { Stack } from "@mui/material";
import { get, set, unset } from "lodash";

import TransactionForm from "../components/TransactionForm";
import { Dialog, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { useNotification } from "hooks";

import {
  ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_END_POINT,
} from "__generated__/END_POINT";

interface CreateTransactionDialogProps {
  open: boolean;
  toggle: (newValue: boolean) => void;
}

const OBJ_DEFAULT_VALUES = {
  source_id: null,
  target_id: null,
  affect_creditor: false,
  type: null,
  payment_method: null,
  status: "Draft",
  source_type: "order.invoice",
  target_type: "customer.customer",
  flow_type: "Cash_in",
  notes: "",
  address: "",
  amount: "",
  target_name: "",
};

const CreateTransactionDialog = ({ open, toggle }: CreateTransactionDialogProps) => {
  const router = useRouter();
  const { data: customerData } = useSWR(() => {
    return transformUrl(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${router.query.id}`);
  });

  const [defaultValues, setDefaultValues] = useState<any>();

  useEffect(() => {
    if (customerData == undefined || !open) return;

    const customer = get(customerData, "official_customer");
    const data = OBJ_DEFAULT_VALUES;

    set(data, "source_type", "order.invoice");
    set(data, "target_type", "customer.customer");
    set(data, "affect_creditor", true);
    set(data, "target_id", customer);
    set(
      data,
      "target_name",
      `${get(customer, "last_name")} ${get(customer, "first_name")}`
    );
    setDefaultValues(data);
  }, [customerData, open]);

  useEffect(() => {
    !open && setDefaultValues(undefined);
  }, [open]);

  const onSuccessHandler = useCallback(() => {
    toggle(false);
  }, []);

  if (defaultValues == undefined) return null;

  return (
    <RootComponent
      {...{
        open,
        toggle,
        defaultValues,
        onSuccessHandler,
      }}
    />
  );
};

interface RootComponentProps extends CreateTransactionDialogProps {
  defaultValues: ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => void;
}

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
          if (loading) {
            return;
          }

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
          children: messages["transactionType"],
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
                disabled={loading}
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
