import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import React, { Fragment, useCallback, useEffect, useState } from "react";

import useSWR from "swr";
import { Stack } from "@mui/material";
import { get, set, unset } from "lodash";

import FormPayment from "./FormPayment";
import { BackButton, Dialog, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { useNotification } from "hooks";

import {
  ADMIN_CASH_TRANSACTIONS_END_POINT,
  ADMIN_PARTNERS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import {
  ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_CASH_TRANSACTIONS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

type PaymentDialogProps = {
  open: boolean;
  onClose: () => void;
  url: string;
};

export interface DEFAULT_VALUES_EXTENDS
  extends ADMIN_CASH_TRANSACTIONS_POST_YUP_SCHEMA_TYPE {
  target_type: any;
  source?: any;
}

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

export default function PaymentDialog(props: PaymentDialogProps) {
  const { open, onClose, url } = props;
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<DEFAULT_VALUES_EXTENDS>();

  const { data: transactionData } = useSWR<ADMIN_CASH_DEBT_RECORD_VIEW_TYPE_V1>(() => {
    return url;
  });

  const { data: partnerData } = useSWR(() => {
    return transformUrl(`${ADMIN_PARTNERS_END_POINT}${router.query.id}`);
  });

  useEffect(() => {
    if (partnerData == undefined || transactionData == undefined || !open) return;

    const data = OBJ_DEFAULT_VALUE;

    set(data, "source", get(transactionData, "source"));
    set(data, "amount", parseFloat(get(transactionData, "debt_amount.incl_tax")));
    set(data, "source_id", get(transactionData, "source.sid"));
    set(data, "source_type", get(transactionData, "source_type"));
    set(data, "target_type", "partner.partner");
    set(data, "target_id", partnerData);
    set(data, "affect_creditor", true);
    set(data, "target_name", get(partnerData, "name"));
    set(data, "address", get(partnerData, "primary_address.line1"));

    setDefaultValues(data);
  }, [transactionData, open, partnerData]);

  useEffect(() => {
    !open && setDefaultValues(undefined);
  }, [open]);

  if (defaultValues == undefined && !open) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ open, onClose, defaultValues }} />;
}

type RootComponentProps = {
  open: boolean;
  onClose: () => void;
  defaultValues: DEFAULT_VALUES_EXTENDS;
};

const RootComponent = (props: RootComponentProps) => {
  const { open, onClose, defaultValues } = props;
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(async ({ data }: { data: DEFAULT_VALUES_EXTENDS }) => {
    try {
      setLoading(true);

      if (get(data, "amount")) {
        set(data, "amount", parseFloat(get(data, "amount")));
      }

      if (get(data, "source_id")) {
        set(data, "source_id", get(data, "source.id"));
      }

      if (get(data, "target_type") === "") {
        set(data, "target_type", null);
      }

      if (get(data, "source")) {
        unset(data, "source");
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
      onClose();
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues,
    resolver: ADMIN_CASH_TRANSACTIONS_POST_YUP_RESOLVER,
  });

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "75vw",
              maxWidth: "85vw",
            },
          },
        },
        DialogTitleProps: {
          children: "Tạo giao dịch",
        },
        dialogContentTextComponent: () => {
          return (
            <Fragment>
              <FormPayment {...{ control, defaultValues, getValues, setValue, watch }} />
            </Fragment>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  onClose();
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
