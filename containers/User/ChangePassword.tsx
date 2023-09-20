import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { Box, Grid, Stack } from "@mui/material";

import { LoadingButton, Card, FormControlForPassword } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { CHANGE_PASSWORD } from "apis";
import { useNotification } from "hooks";
import { changePasswordSchema, defaultChangePasswordFormState } from "yups";

const ChangePassword = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: defaultChangePasswordFormState(),
    resolver: changePasswordSchema(),
  });

  const isMounted = useMountedState();

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);

      await axios.post(CHANGE_PASSWORD, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "mật khẩu mới",
        })
      );
      router.replace("/logout");
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
      <Grid item xs={8}>
        <Card
          title={messages["createNewPassword"]}
          cardBodyComponent={() => {
            return (
              <Box component="form">
                <Grid container justifyContent="flex-start">
                  <Grid item xs={6}>
                    <FormControlForPassword
                      {...{
                        control,
                        name: "password",
                        label: messages["newPassword"] as string,
                        placeholder: messages["newPassword"] as string,
                        FormControlProps: {
                          required: true,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlForPassword
                      {...{
                        control,
                        name: "confirm_password",
                        label: messages["confirmNewPassword"] as string,
                        placeholder: messages["confirmNewPassword"] as string,
                        FormControlProps: {
                          required: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            );
          }}
        />
      </Grid>

      <Grid item xs={8}>
        <Stack flexDirection="row" justifyContent="flex-end" alignItems="center">
          <LoadingButton
            {...{
              loading,
              disabled:
                watch("password") !== watch("confirm_password") ||
                watch("password") === "" ||
                watch("confirm_password") === "",

              onClick: handleSubmit((data) => {
                onSubmit(data);
              }),
            }}
          >
            {loading ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
