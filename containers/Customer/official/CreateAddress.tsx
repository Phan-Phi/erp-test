import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { set } from "lodash";
import { Stack, Grid } from "@mui/material";

import AddressForm from "../components/AddressForm";
import { Card, LoadingButton, BackButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { CUSTOMERS, DETAIL, EDIT } from "routes";

import {
  ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateAddress = ({ onSuccessHandler }) => {
  const { control, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: { ...ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE },
    resolver: ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        const id = router.query.id;

        set(data, "user", id);

        await axios.post(ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT, data);

        typeof onSuccessHandler === "function" && (await onSuccessHandler());

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "địa chỉ khách hàng",
          })
        );

        router.replace(`/${CUSTOMERS}/${DETAIL}/${id}/${EDIT}/${id}`);
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
      <Grid item xs={12}>
        <Card
          title={messages["addNewAddress"] as string}
          cardBodyComponent={() => {
            return (
              <AddressForm
                {...{
                  control,
                  getValues,
                  watch,
                  setValue,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent={"space-between"}>
          <BackButton onClick={router.back} />

          <LoadingButton
            loading={!!loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateAddress;
