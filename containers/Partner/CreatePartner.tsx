import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useState, Fragment } from "react";

import { get, set } from "lodash";
import { Grid, Stack } from "@mui/material";

import { FormControl } from "compositions";
import PartnerForm from "./components/PartnerForm";
import PartnerAddressForm from "./components/PartnerAddressForm";
import { Card, BackButton, LoadingButton, Spacing } from "components";

import axios from "axios.config";
import { PARTNERS } from "routes";
import DynamicMessage from "messages";
import { useNotification } from "hooks";

import {
  ADMIN_PARTNERS_POST_YUP_RESOLVER,
  ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE,
  ADMIN_PARTNERS_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_PARTNERS_POST_DEFAULT_VALUE,
  ADMIN_PARTNERS_ADDRESSES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_PARTNERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

const CreatePartner = () => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const { control: partnerControl, handleSubmit: partnerHandleSubmit } = useForm({
    defaultValues: ADMIN_PARTNERS_POST_DEFAULT_VALUE,
    resolver: ADMIN_PARTNERS_POST_YUP_RESOLVER,
  });

  const {
    control: partnerAddressControl,
    handleSubmit: partnerAddressHandleSubmit,
    setValue: partnerAddressSetValue,
    watch: partnerAddressWatch,
  } = useForm({
    defaultValues: { ...ADMIN_PARTNERS_ADDRESSES_POST_DEFAULT_VALUE },
    resolver: ADMIN_PARTNERS_ADDRESSES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      addressData,
    }: {
      data: ADMIN_PARTNERS_POST_YUP_SCHEMA_TYPE;
      addressData: ADMIN_PARTNERS_ADDRESSES_POST_YUP_SCHEMA_TYPE;
    }) => {
      try {
        setLoading(true);

        const { data: resData } = await axios.post(ADMIN_PARTNERS_END_POINT, data);

        const partnerId = get(resData, "id");

        if (partnerId) {
          set(addressData, "partner", partnerId);

          await axios.post(ADMIN_PARTNERS_ADDRESSES_END_POINT, addressData);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "đối tác",
            })
          );

          router.replace(`/${PARTNERS}`);
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
      <Grid item xs={9}>
        <Card
          title={messages["createPartner"]}
          cardBodyComponent={() => {
            return (
              <Fragment>
                <PartnerForm control={partnerControl} />

                <Spacing spacing={3} />

                <PartnerAddressForm
                  control={partnerAddressControl}
                  setValue={partnerAddressSetValue}
                  watch={partnerAddressWatch}
                />

                <Spacing spacing={3} />

                <Controller
                  control={partnerControl}
                  name="notes"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["note"] as string}
                        placeholder={messages["note"] as string}
                        InputProps={{
                          multiline: true,
                          rows: 5,
                          sx: {
                            padding: 1,
                          },
                        }}
                      />
                    );
                  }}
                />
              </Fragment>
            );
          }}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PARTNERS}`} />

          <LoadingButton
            {...{
              loading,
              onClick: partnerHandleSubmit((data) => {
                partnerAddressHandleSubmit((addressData) => {
                  onSubmit({
                    data,
                    addressData,
                  });
                })();
              }),
            }}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreatePartner;
