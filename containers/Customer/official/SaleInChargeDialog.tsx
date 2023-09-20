import { KeyedMutator } from "swr";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useEffect, useCallback } from "react";

import { Stack } from "@mui/material";
import { get, unset, isEmpty } from "lodash";

import Loading from "components/Loading/LoadingTable";
import SaleInChargeForm from "../components/SaleInChargeForm";
import { Dialog, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import {
  ADMIN_CUSTOMERS_END_POINT,
  ADMIN_USERS_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

interface SaleInChargeDialog {
  open: boolean;
  toggle: (newValue: boolean) => void;
  customerInfo: any | undefined;
  mutate: KeyedMutator<any>;
}

const defaultSaleInCharge = {
  sales_in_charge: null,
  max_debt: "",
};

const SaleInChargeDialog = ({
  open,
  toggle,
  customerInfo,
  mutate,
}: SaleInChargeDialog) => {
  const [defaultValues, setDefaultValues] = useState<any>();

  useEffect(() => {
    if (!open || customerInfo == undefined) return;

    const salesInCharge = get(customerInfo, "sales_in_charge");
    const maxDebt = get(customerInfo, "max_debt.incl_tax");
    const id = get(customerInfo, "id");

    if (!isEmpty(salesInCharge)) {
      setDefaultValues({
        sales_in_charge: salesInCharge,
        max_debt: parseFloat(maxDebt).toString(),
        id,
      });
    } else {
      setDefaultValues({
        ...defaultSaleInCharge,
        id,
      });
    }
  }, [customerInfo, open]);

  const onSuccessHandler = useCallback(async () => {
    await mutate();
    toggle(false);
  }, []);

  if (!open && defaultValues == undefined) return null;

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ open, toggle, defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps extends Omit<SaleInChargeDialog, "mutate" | "customerInfo"> {
  onSuccessHandler: () => Promise<void>;
  defaultValues: ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
}

const RootComponent = ({
  open,
  toggle,
  defaultValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const { messages, formatMessage } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_CUSTOMERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);
        const id = get(data, "id");

        unset(data, "id");

        await axios.patch(`${ADMIN_CUSTOMERS_END_POINT}${id}/`, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.addSuccessfully, {
            content: "sale phụ trách",
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
        DialogProps: {
          PaperProps: {
            sx: {
              maxWidth: "40vw",
              minWidth: "40vw",
            },
          },
        },
        onClose: () => {
          toggle(false);
        },
        DialogTitleProps: {
          children: messages["saleInCharge"],
        },
        dialogContentTextComponent: () => {
          return <SaleInChargeForm {...{ control, url: ADMIN_USERS_END_POINT }} />;
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
                onClick={handleSubmit((data) => {
                  onSubmit({ data });
                })}
                disabled={!isDirty}
                loading={loading}
              >
                {loading ? messages["updatingStatus"] : messages["updateStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default SaleInChargeDialog;
