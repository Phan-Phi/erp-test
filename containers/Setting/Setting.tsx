import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useCallback, useState, useEffect } from "react";

import useSWR from "swr";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import {
  transformUrl,
  transformJSONToFormData,
  convertValueToTupleForAddress,
} from "libs";
import { SETTING } from "apis";
import { useIntl } from "react-intl";
import { useNotification } from "hooks";
import { SETTING_ITEM } from "interfaces";
import { settingSchema, defaultSettingFormState, SettingSchemaProps } from "yups";
import { Card, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import SettingForm from "./components/SettingForm";
import { ADMIN_SETTINGS_END_POINT } from "__generated__/END_POINT";
import {
  ADMIN_SETTINGS_PATCH_YUP_RESOLVER,
  ADMIN_SETTINGS_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

const Setting = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const { data: resSettingData, mutate: settingMutate } =
    useSWR<ADMIN_SETTINGS_PATCH_YUP_SCHEMA_TYPE>(
      transformUrl(ADMIN_SETTINGS_END_POINT, {
        use_cache: false,
      })
    );

  const [defaultValues, setDefaultValues] = useState<SettingSchemaProps>();

  useEffect(() => {
    if (resSettingData == undefined) return;

    const keyList = Object.keys(defaultSettingFormState());

    const body = {} as SettingSchemaProps;

    keyList.forEach((key) => {
      let temp = get(resSettingData, key);

      if (key === "logo") {
        if (temp) {
          temp = [{ file: temp.default }];
        } else {
          temp = [];
        }
      }

      if (key === "invoice_qr_code") {
        if (temp) {
          temp = [{ file: temp }];
        } else {
          temp = [];
        }
      }

      set(body, key, temp);
    });

    convertValueToTupleForAddress(resSettingData).then((data) => {
      if (data && isMounted()) {
        const { province, district, ward } = data;

        set(body, "province", province[0] === "" ? null : province);
        set(body, "district", district[0] === "" ? null : district);
        set(body, "ward", ward[0] === "" ? null : ward);
      }

      setDefaultValues(body);
    });
  }, [resSettingData]);

  const onSuccessHandler = useCallback(async () => {
    await settingMutate();

    router.push("/");
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponent {
  defaultValues: SettingSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponent) => {
  const {
    watch,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: settingSchema(),
    resolver: ADMIN_SETTINGS_PATCH_YUP_RESOLVER,
  });

  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithError, enqueueSnackbarWithSuccess } =
    useNotification();

  const onSubmit = useCallback(
    async ({ data, dirtyFields }: { data: SettingSchemaProps; dirtyFields: object }) => {
      setLoading(true);

      const logo = get(data, "logo").map((el) => {
        return el.file;
      });

      set(data, "logo", logo);

      const invoice_qr_code = get(data, "invoice_qr_code").map((el) => {
        return el.file;
      });

      set(data, "invoice_qr_code", invoice_qr_code);

      let shouldUpdateList = ["ward", "district", "province"];

      shouldUpdateList.forEach((key) => {
        if (!isEmpty(data[key])) {
          set(data, key, get(data[key], "[0]"));
        } else {
          set(data, key, "");
        }
      });

      try {
        const formData = transformJSONToFormData(data, dirtyFields);
        await axios.patch(ADMIN_SETTINGS_END_POINT, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (isEmpty(logo)) {
          await axios.patch(ADMIN_SETTINGS_END_POINT, {
            logo: null,
          });
        }

        if (isEmpty(invoice_qr_code)) {
          await axios.patch(ADMIN_SETTINGS_END_POINT, {
            invoice_qr_code: null,
          });
        }

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "thiết lập",
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
    <Grid container justifyContent={"center"}>
      <Grid item xs={9}>
        <Card
          {...{
            title: messages["settingInfo"] as string,
            body: (
              <Grid container>
                <SettingForm
                  {...{
                    watch,
                    control,
                    setValue,
                    setError,
                    clearErrors,
                  }}
                />
              </Grid>
            ),
          }}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname="/" />
          <LoadingButton
            loading={loading}
            disabled={loading}
            onClick={handleSubmit((data) => {
              onSubmit({
                data,
                dirtyFields,
              });
            })}
          >
            {loading
              ? (messages["updatingStatus"] as string)
              : (messages["updateStatus"] as string)}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Setting;
