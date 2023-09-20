import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useSession } from "next-auth/react";
import { useState, useCallback, useEffect } from "react";

import { Box, Stack, styled } from "@mui/material";

import get from "lodash/get";

import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";
import LoginFooter from "./components/LoginFooter";

import { LoadingButton } from "components";

import { loginSchema, defaultLoginFormState, LoginSchemaProps } from "yups";

import { PUBLIC_SETTING } from "apis";

const Login = () => {
  const { data: settingData } = useSWR(PUBLIC_SETTING);

  const router = useRouter();
  const { messages } = useIntl();
  const { status } = useSession();
  const isMounted = useMountedState();
  const { enqueueSnackbar } = useSnackbar();

  const [loginLoading, setLoginLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: defaultLoginFormState(),
    resolver: loginSchema(),
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status]);

  const onLoginHandler = useCallback(async (data: LoginSchemaProps) => {
    setLoginLoading(true);

    try {
      const result = await signIn("sign-in", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        enqueueSnackbar("Tên đăng nhập hoặc mật khẩu không đúng", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(messages["loginSuccessfully"], {
          variant: "success",
        });
      }
    } catch (err) {
    } finally {
      if (isMounted()) {
        setLoginLoading(false);
      }
    }
  }, []);

  if (status === "authenticated") {
    return null;
  }

  return (
    <Wrapper>
      <Box
        sx={{
          minWidth: "600px",
          width: "fit-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoginHeader src={get(settingData, "logo.default")} />
        </Box>

        <Stack spacing={2} component="form">
          <LoginForm control={control} />

          <Box>
            <LoadingButton
              loading={loginLoading}
              onClick={handleSubmit(onLoginHandler)}
              fullWidth={false}
              type="submit"
            >
              {loginLoading ? messages["loggingIn"] : messages["login"]}
            </LoadingButton>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <LoginFooter />
        </Box>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)({
  width: "100%",
  maxWidth: "100vw",
  minHeight: "100vh",
  maxHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

export default Login;
