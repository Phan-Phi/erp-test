import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback } from "react";

import { get, set, unset, isEmpty } from "lodash";
import { Button, Grid, Stepper, Step, StepLabel, Stack } from "@mui/material";

import UserForm from "./components/UserForm";
import { LoadingButton, BackButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { CUSTOMERS } from "routes";
import DynamicMessage from "messages";
import { transformJSONToFormData } from "libs";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_CUSTOMERS_DRAFTS_POST_YUP_RESOLVER,
  ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
  ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE,
  ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

import {
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT,
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
} from "__generated__/END_POINT";

const AddressForm = dynamic(() => import("./components/AddressForm"), {
  loading: () => {
    return <Loading />;
  },
});

const steps = [1, 2];

const CreateCustomer = () => {
  const { control, getValues, setError, handleSubmit, clearErrors, watch, reset } =
    useForm({
      defaultValues: { ...ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE },

      resolver: ADMIN_CUSTOMERS_DRAFTS_POST_YUP_RESOLVER,
    });

  const {
    control: customerAddressControl,
    setValue: customerAddressSetValue,
    watch: customerAddressWatch,
    handleSubmit: customerAddressHandleSubmit,
    reset: customerAddressReset,
  } = useForm({
    defaultValues: { ...ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE },
    resolver: ADMIN_USERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [activeStep, setActiveStep] = useState(0);

  const onSubmitHandler = useCallback(
    async (data: {
      customerData: ADMIN_CUSTOMERS_DRAFTS_POST_YUP_SCHEMA_TYPE;
      addressData: ADMIN_USERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
    }) => {
      const { customerData, addressData } = data;

      setLoading(true);

      const birthday = get(customerData, "birthday");
      const taxIdentificationNumber = get(customerData, "tax_identification_number");
      const type = get(customerData, "type");
      const email = get(customerData, "email");
      const avatar = get(customerData, "avatar");

      if (!isEmpty(avatar)) {
        const transformedAvatar = avatar.map((el) => {
          return el.file;
        });

        set(customerData, "avatar", transformedAvatar);
      }

      if (taxIdentificationNumber === "") {
        unset(customerData, "tax_identification_number");
      }

      if (birthday) {
        set(customerData, "birthday", birthday);
      }

      if (!isEmpty(type)) {
        set(customerData, "type", get(type, "id"));
      }

      if (email === "") {
        unset(customerData, "email");
      }

      let customerId;
      let customerToken;

      try {
        const formData = transformJSONToFormData(customerData);

        const { data: customerResData } = await axios.post(
          ADMIN_CUSTOMERS_DRAFTS_END_POINT,
          formData,
          {
            headers: {
              "Content-Type": `multipart/form-data`,
            },
          }
        );

        customerId = get(customerResData, "id");
        customerToken = get(customerResData, "token");

        if (customerId) {
          set(addressData, "user", customerId);

          await axios.post(ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT, addressData);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "khách hàng",
            })
          );

          let pathname = `/${CUSTOMERS}`;

          router.push(pathname, pathname, {
            shallow: true,
          });
        }
      } catch (err) {
        await axios.post(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${customerId}/refuse/`, {
          token: customerToken,
        });

        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const stepNextHandler = useCallback(() => {
    if (activeStep === 0) {
      handleSubmit((data) => {
        setActiveStep(1);
      })();
    } else if (activeStep === 1) {
      customerAddressHandleSubmit((data) => {
        const customerData = getValues();

        onSubmitHandler({
          customerData,
          addressData: data,
        });
      })();
    }
  }, [activeStep, getValues]);

  const stepBackHandler = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const resetDefaultStepHandler = useCallback(() => {
    setActiveStep(0);
    reset(
      {
        ...ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE,
      },
      { keepDirty: false }
    );
    customerAddressReset(
      {
        ...ADMIN_USERS_ADDRESSES_POST_DEFAULT_VALUE,
      },
      { keepDirty: false }
    );
  }, []);

  return (
    <Grid container>
      <Grid item xs={8}>
        <Stepper activeStep={activeStep} sx={{ marginBottom: 5 }}>
          {steps.map((el, idx) => {
            return (
              <Step key={idx}>
                <StepLabel>{messages[`customer.step${idx + 1}`]}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
      <Grid item xs={10}>
        {activeStep === 0 && (
          <UserForm
            {...{
              control,
              watch,
              setError,
              clearErrors,
            }}
          />
        )}
        {activeStep === 1 && (
          <AddressForm
            {...{
              control: customerAddressControl,
              setValue: customerAddressSetValue,
              watch: customerAddressWatch,
            }}
          />
        )}
      </Grid>
      <Grid item xs={10}>
        {activeStep === 0 && (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <BackButton pathname={`/${CUSTOMERS}`} />

            <Stack flexDirection="row" columnGap={2}>
              <Button onClick={resetDefaultStepHandler} variant="outlined" color="error">
                {messages["resetButton"]}
              </Button>
              <Button onClick={stepNextHandler}>
                {activeStep === steps.length - 1
                  ? messages["completeButton"]
                  : messages["continueButton"]}
              </Button>
            </Stack>
          </Stack>
        )}
        {activeStep === 1 && (
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <BackButton variant="outlined" disabled={loading} onClick={stepBackHandler} />
            <Stack flexDirection="row" columnGap={2}>
              <Button
                variant="outlined"
                disabled={loading}
                onClick={resetDefaultStepHandler}
                color="error"
              >
                {messages["resetButton"]}
              </Button>

              <LoadingButton loading={loading} onClick={stepNextHandler}>
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};

export default CreateCustomer;
