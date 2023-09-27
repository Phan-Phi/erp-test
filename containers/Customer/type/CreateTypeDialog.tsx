import useSWR from "swr";
import { useIntl } from "react-intl";
import { get, set } from "lodash";
import { useForm } from "react-hook-form";
import { Grid, Stack } from "@mui/material";
import { useMemo, useCallback, useState } from "react";

import { useSnackbar } from "notistack";

import CustomerTypeForm from "./components/CustomerTypeForm";
import { LoadingDynamic as Loading, LoadingButton, Dialog, BackButton } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { transformCustomerTypeData } from "./utils";

import {
  ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

interface CreateTypeDialogProps {
  open: boolean;
  toggle: (newValue: boolean) => void;
}

const CreateTypeDialog = ({ open, toggle }: CreateTypeDialogProps) => {
  const { formatMessage, messages } = useIntl();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE,
    resolver: ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  });

  const { data: customerTypeData, mutate } = useSWR(() => {
    const params = {
      get_all: true,
      nested_depth: 1,
      use_cache: false,
    };
    return transformUrl(ADMIN_CUSTOMERS_TYPES_END_POINT, params);
  });

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE }) => {
      setLoading(true);

      if (data?.parent) {
        const id = get(data, "parent");
        set(data, "parent", id);
      }

      try {
        await axios.post(ADMIN_CUSTOMERS_TYPES_END_POINT, data);

        await mutate();

        reset({ ...ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE });

        enqueueSnackbar(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "nhóm khách hàng",
          }),
          {
            variant: "success",
          }
        );

        toggle(false);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const transformedData = useMemo(() => {
    return transformCustomerTypeData(customerTypeData);
  }, [customerTypeData]);

  if (transformedData === undefined) {
    return <Loading />;
  }

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
              width: "50vw",
              maxWidth: "60vw",
            },
          },
        },

        dialogContentTextComponent: () => {
          return (
            <Grid container>
              <Grid item xs={12}>
                <CustomerTypeForm {...{ control, customerTypeData: transformedData }} />
              </Grid>
            </Grid>
          );
        },

        DialogContentProps: {
          sx: {
            paddingTop: "24px !important",
          },
        },

        DialogTitleProps: {
          children: messages["customerType"],
        },

        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  toggle(false);
                }}
                disabled={loading}
              />

              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={handleSubmit((data) => {
                  onSubmit({
                    data,
                  });
                })}
              >
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
};

export default CreateTypeDialog;
