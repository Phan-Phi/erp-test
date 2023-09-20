import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect, Fragment } from "react";
import { useForm, Controller, FieldNamesMarkedBoolean } from "react-hook-form";

import useSWR from "swr";
import { Grid, Stack } from "@mui/material";
import { get, set, pick, isEmpty } from "lodash";

import {
  Card,
  Spacing,
  BackButton,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";

import { FormControl } from "compositions";
import PartnerForm from "./components/PartnerForm";
import PartnerAddressForm from "./components/PartnerAddressForm";

import axios from "axios.config";
import { PARTNERS } from "routes";
import DynamicMessage from "messages";

import { usePermission, useNotification } from "hooks";
import { transformUrl, convertValueToTupleForAddress } from "libs";

import {
  ADMIN_PARTNERS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
  ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import {
  ADMIN_PARTNERS_END_POINT,
  ADMIN_PARTNERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

const EditPartner = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const [defaultValues, setDefaultValues] =
    useState<ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>();

  const [defaultAddressValues, setDefaultAddressValues] = useState<any>();

  const { data: partnerData, mutate: partnerMutate } = useSWR<any>(() => {
    const partnerId = router.query.id;

    if (partnerId == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${ADMIN_PARTNERS_END_POINT}${partnerId}`, params);
  });

  useEffect(() => {
    if (partnerData == undefined) return;

    const data: ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
      {} as ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;

    const selectedKey = [
      "id",
      "name",
      "tax_identification_number",
      "notes",
      "contact_info",
      "email",
    ];

    for (const key of selectedKey) {
      data[key] = partnerData[key];
    }

    const maxDebt = get(partnerData, "max_debt.incl_tax");
    const totalDebtAmount = get(partnerData, "total_debt_amount.incl_tax");

    set(data, "max_debt", parseFloat(maxDebt).toString());
    set(data, "total_debt_amount", parseFloat(totalDebtAmount).toString());

    setDefaultValues(data);

    const primaryAddress = get(partnerData, "primary_address");

    if (!isEmpty(primaryAddress)) {
      let addressData = pick(primaryAddress, ["id", "line1", "country", "phone_number"]);

      convertValueToTupleForAddress(primaryAddress).then((data) => {
        if (data && isMounted()) {
          const { province, district, ward } = data;

          set(addressData, "province", province[0] === "" ? null : province);
          set(addressData, "district", district[0] === "" ? null : district);
          set(addressData, "ward", ward[0] === "" ? null : ward);
        }

        setDefaultAddressValues(addressData);
      });
    }
  }, [partnerData]);

  const onSuccessHandler = useCallback(async () => {
    partnerMutate();

    router.replace(`/${PARTNERS}`);
  }, []);

  if (defaultValues == undefined || defaultAddressValues == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultValues,
        defaultAddressValues,
        onSuccessHandler,
      }}
    />
  );
};

type RootComponentProps = {
  defaultValues: ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  defaultAddressValues: ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({
  defaultValues,
  defaultAddressValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(false);
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_partner");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const {
    control: partnerControl,
    handleSubmit: partnerHandleSubmit,
    formState: { dirtyFields: partnerDirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_PARTNERS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    control: partnerAddressControl,
    handleSubmit: partnerAddressHandleSubmit,
    setValue: partnerAddressSetValue,
    watch: partnerAddressWatch,
    formState: { dirtyFields: partnerAddressDirtyFields },
  } = useForm({
    defaultValues: defaultAddressValues,
    resolver: ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
      addressData,
      addressDirtyFields,
    }: {
      data: ADMIN_PARTNERS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
      addressData: ADMIN_WAREHOUSES_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      addressDirtyFields: FieldNamesMarkedBoolean<typeof defaultAddressValues>;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const partnerId = get(data, "id");

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_PARTNERS_END_POINT}${partnerId}/`, body);
        }

        if (!isEmpty(addressDirtyFields)) {
          const partnerAddressId = get(addressData, "id");

          const body = pick(addressData, Object.keys(addressDirtyFields));

          await axios.patch(
            `${ADMIN_PARTNERS_ADDRESSES_END_POINT}${partnerAddressId}/`,
            body
          );
        }

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "đối tác",
          })
        );

        onSuccessHandler();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) setLoading(false);
      }
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["updatePartner"]}
          body={
            <Fragment>
              <PartnerForm control={partnerControl} defaultValues={defaultValues} />

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
          }
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PARTNERS}`} />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
                onClick: partnerHandleSubmit((data) => {
                  partnerAddressHandleSubmit((addressData) => {
                    onSubmit({
                      data,
                      addressData,
                      dirtyFields: partnerDirtyFields,
                      addressDirtyFields: partnerAddressDirtyFields,
                    });
                  })();
                }),
              }}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditPartner;
