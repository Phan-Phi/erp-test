import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect } from "react";

import { Stack, Grid } from "@mui/material";

import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import { Card, LoadingButton, BackButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { USER_ADDRESS } from "apis";
import { USERS, DETAIL } from "routes";
import { useNotification } from "hooks";
import { transformUrl, convertValueToTupleForAddress } from "libs";
import {
  userAddressSchema,
  UserAddressSchemaProps,
  defaultUserAddressFormState,
} from "yups";
import AddressForm from "./AddressForm";
import DynamicMessage from "messages";

import { USER_ADDRESS_ITEM } from "interfaces";

interface UpdateAddressProps {
  onSuccessHandler: () => Promise<void>;
}

const UpdateAddress = ({ onSuccessHandler: updateAddress }: UpdateAddressProps) => {
  const router = useRouter();

  const isMounted = useMountedState();

  const [defaultValues, setDefaultValues] = useState<UserAddressSchemaProps>();

  const { data: addressData, mutate: addressMutate } = useSWR<USER_ADDRESS_ITEM>(() => {
    const addressId = get(router, "query.ids.[2]");

    if (addressId == undefined) return;

    return transformUrl(`${USER_ADDRESS}${addressId}`);
  });

  useEffect(() => {
    if (addressData == undefined) return;

    convertValueToTupleForAddress(addressData).then((resData) => {
      if (resData && isMounted()) {
        const { province, ward, district } = resData;

        const userId = get(addressData, "user.id");

        const data = {} as UserAddressSchemaProps;

        const keyList = [...Object.keys(defaultUserAddressFormState()), "id"];

        keyList.forEach((key) => {
          set(data, key, addressData[key]);
        });

        setDefaultValues({
          ...data,
          province: province[0] === "" ? null : province,
          district: district[0] === "" ? null : district,
          ward: ward[0] === "" ? null : ward,
          user: userId,
        });
      }
    });
  }, [addressData]);

  const onSuccessHandler = useCallback(async () => {
    addressMutate();

    const id = get(router, "query.ids[0]");

    updateAddress();

    router.replace(`/${USERS}/${DETAIL}/${id}/`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent defaultValues={defaultValues} onSuccessHandler={onSuccessHandler} />
  );
};

interface RootComponentProps extends UpdateAddressProps {
  defaultValues: UserAddressSchemaProps;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: userAddressSchema(),
  });

  const router = useRouter();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: UserAddressSchemaProps;
      dirtyFields: object;
    }) => {
      try {
        if (!isEmpty(dirtyFields)) {
          let shouldUpdateList = ["ward", "district", "province"];

          shouldUpdateList.forEach((key) => {
            if (!isEmpty(data[key])) {
              set(data, key, get(data[key], "[0]"));
            } else {
              set(data, key, "");
            }
          });

          let body = {};

          Object.keys(dirtyFields).forEach((key) => {
            set(body, key, data[key]);
          });

          setLoading(true);

          const id = get(data, "id");

          await axios.patch(`${USER_ADDRESS}${id}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "địa chỉ người dùng",
            })
          );

          onSuccessHandler();
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
      <Grid item xs={12}>
        <Card
          title={messages["updateAddress"]}
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
            loading={!!loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data, dirtyFields });
            })}
          >
            {loading ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default UpdateAddress;
