import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Stack, Grid } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import {
  userAddressSchema,
  UserAddressSchemaProps,
  defaultUserAddressFormState,
} from "yups";
import { USER_ADDRESS } from "apis";
import { useIntl } from "react-intl";
import { USERS, DETAIL } from "routes";
import { useNotification } from "hooks";
import { Card, LoadingButton, BackButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import AddressForm from "./AddressForm";

interface CreateAddressProps {
  onSuccessHandler: () => Promise<void>;
}

const CreateAddress = ({ onSuccessHandler }: CreateAddressProps) => {
  const { control, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: defaultUserAddressFormState(),
    resolver: userAddressSchema(),
  });

  const router = useRouter();
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const onSubmit = useCallback(async ({ data }: { data: UserAddressSchemaProps }) => {
    try {
      setLoading(true);
      const id = get(router, "query.ids.[0]");

      let shouldUpdateList = ["ward", "district", "province"];

      set(data, "user", id);

      shouldUpdateList.forEach((key) => {
        if (!isEmpty(data[key])) {
          set(data, key, get(data[key], "[0]"));
        } else {
          set(data, key, "");
        }
      });

      await axios.post(USER_ADDRESS, data);

      await onSuccessHandler();

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "địa chỉ người dùng",
        })
      );

      router.replace(`/${USERS}/${DETAIL}/${id}/`);
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
      <Grid item xs={12}>
        <Card
          title={messages["addNewAddress"]}
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
          <BackButton onClick={router.back} disabled={loading} />

          <LoadingButton
            loading={loading}
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
