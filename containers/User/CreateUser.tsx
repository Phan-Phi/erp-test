import get from "lodash/get";
import set from "lodash/set";
import dynamic from "next/dynamic";
import isEmpty from "lodash/isEmpty";

import { useIntl } from "react-intl";
import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback } from "react";
import { Box, Button, Grid, Stepper, Step, StepLabel, Stack } from "@mui/material";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_USERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";
import {
  ADMIN_USERS_POST_DEFAULT_VALUE,
  ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";
import {
  ADMIN_USERS_POST_YUP_RESOLVER,
  ADMIN_USERS_POST_YUP_SCHEMA_TYPE,
  ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { USERS } from "routes";
import { transformJSONToFormData } from "libs";
import { useChoice, useNotification } from "hooks";
import { BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import UserForm from "./components/UserForm";

const AddressForm = dynamic(() => import("./components/AddressForm"), {
  loading: () => {
    return <Loading />;
  },
});

const steps = [1, 2];

const CreateUser = () => {
  const choice = useChoice();

  const { control, getValues, setError, handleSubmit, clearErrors, reset } = useForm({
    // defaultValues: defaultUserFormState(choice),
    // resolver: userSchema(choice),
    defaultValues: { ...ADMIN_USERS_POST_DEFAULT_VALUE },
    resolver: ADMIN_USERS_POST_YUP_RESOLVER,
  });

  const {
    control: userAddressControl,
    setValue: userAddressSetValue,
    watch: userAddressWatch,
    handleSubmit: userAddressHandleSubmit,
    reset: userAddressReset,
  } = useForm({
    // defaultValues: defaultUserAddressFormState(),
    // resolver: userAddressSchema(),
    defaultValues: { ...ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE },
    resolver: ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const router = useRouter();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [activeStep, setActiveStep] = useState(0);
  const { formatMessage, messages } = useIntl();

  const stepNextHandler = useCallback(() => {
    if (activeStep === 0) {
      handleSubmit((data) => {
        setActiveStep(1);
      })();
    } else if (activeStep === 1) {
      userAddressHandleSubmit((data) => {
        const customerData: any = getValues();

        onSubmitHandler({
          customerData,
          addressData: data as any,
        });
      })();
    }
  }, [activeStep, getValues]);

  const stepBackHandler = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const resetDefaultStepHandler = useCallback(() => {
    setActiveStep(0);
    reset({ ...ADMIN_USERS_POST_DEFAULT_VALUE }, { keepDirty: false });
    userAddressReset(
      { ...ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE },
      { keepDirty: false }
    );
  }, []);

  const onSubmitHandler = useCallback(
    async ({
      customerData,
      addressData,
    }: {
      customerData: ADMIN_USERS_POST_YUP_SCHEMA_TYPE;
      addressData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
    }) => {
      setLoading(true);
      const avatar = get(customerData, "avatar");

      if (!isEmpty(avatar)) {
        const transformedAvatar = avatar.map((el) => {
          return el.file;
        });

        set(customerData, "avatar", transformedAvatar);
      }
      // const transformedAvatar = get(customerData, "avatar").map((el) => {
      //   return el.file;
      // });

      const email = get(customerData, "email");

      if (email === "") {
        set(customerData, "email", null);
      }

      // set(customerData, "avatar", transformedAvatar);

      const birthday = get(customerData, "birthday");

      if (birthday && birthday instanceof Date) {
        set(customerData, "birthday", formatISO(birthday));
      }

      let shouldUpdateList = ["ward", "district", "province"];

      shouldUpdateList.forEach((key) => {
        if (!isEmpty(addressData[key])) {
          set(addressData, key, get(addressData[key], "[0]"));
        } else {
          set(addressData, key, "");
        }
      });

      try {
        const formData = transformJSONToFormData(customerData);

        const { data: userData } = await axios.post(ADMIN_USERS_END_POINT, formData, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        });
        const userId = get(userData, "id");

        if (userId) {
          set(addressData, "user", userId);

          await axios.post(ADMIN_USERS_ADDRESSES_END_POINT, addressData);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "người dùng",
            })
          );

          let pathname = `/${USERS}`;

          router.push(pathname, pathname, {
            shallow: true,
          });
        }
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
      <Grid item xs={8}>
        <Box marginX="auto">
          <Stepper activeStep={activeStep} sx={{ marginBottom: 5 }}>
            {steps.map((label, idx) => {
              return (
                <Step key={idx}>
                  <StepLabel>{messages[`user.step${idx + 1}`]}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Grid>
      <Grid item xs={10}>
        {activeStep === 0 && (
          <Stack spacing={3}>
            <UserForm
              {...{
                control,
                clearErrors,
                setError,
              }}
            />

            <Stack flexDirection="row" justifyContent="space-between">
              <BackButton pathname={`/${USERS}`} />

              <Stack flexDirection="row" columnGap={2}>
                <Button
                  onClick={resetDefaultStepHandler}
                  variant="outlined"
                  color="error"
                >
                  {messages["resetButton"]}
                </Button>
                <Button onClick={stepNextHandler} variant="contained">
                  {activeStep === steps.length - 1
                    ? messages["completeButton"]
                    : messages["continueButton"]}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={3}>
            <AddressForm
              {...{
                control: userAddressControl,
                setValue: userAddressSetValue,
                watch: userAddressWatch,
              }}
            />

            <Stack flexDirection="row" justifyContent="space-between">
              <BackButton onClick={stepBackHandler} disabled={loading} />

              <Stack flexDirection={"row"} columnGap={2}>
                <Button
                  onClick={resetDefaultStepHandler}
                  variant="outlined"
                  color="error"
                  disabled={loading}
                >
                  {messages["resetButton"]}
                </Button>

                <LoadingButton loading={loading} onClick={stepNextHandler}>
                  {loading ? messages["creatingStatus"] : messages["completeButton"]}
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};

export default CreateUser;
