import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useCallback, Fragment } from "react";

import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";

import { WAREHOUSES } from "routes";
import { useNotification } from "hooks";
import { WAREHOUSE, WAREHOUSE_ADDRESS } from "apis";
import { Card, BackButton, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import WarehouseForm from "./components/WarehouseForm";
import WarehouseAddressForm from "./components/WarehouseAddressForm";

import {
  ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA_TYPE,
  ADMIN_WAREHOUSES_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import {
  ADMIN_WAREHOUSES_ADDRESSES_POST_DEFAULT_VALUE,
  ADMIN_WAREHOUSES_POST_DEFAULT_VALUE,
} from "__generated__/POST_DEFAULT_VALUE";

const CreateWarehouse = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const isMounted = useMountedState();

  const { control: warehouseControl, handleSubmit: warehouseHandleSubmit } = useForm({
    defaultValues: ADMIN_WAREHOUSES_POST_DEFAULT_VALUE,
    resolver: ADMIN_WAREHOUSES_POST_YUP_RESOLVER,
    // defaultValues: defaultWarehouseFormState(),
    // resolver: warehouseSchema(),
  });

  const {
    control: warehouseAddressControl,
    handleSubmit: warehouseAddressHandleSubmit,
    watch: warehouseAddressWatch,
    setValue: warehouseAddressSetValue,
  } = useForm({
    defaultValues: { ...ADMIN_WAREHOUSES_ADDRESSES_POST_DEFAULT_VALUE },
    resolver: ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER,
    // defaultValues: defaultWarehouseAddressFormState(),
    // resolver: warehouseAddressSchema(),
  });

  const onSubmit = useCallback(
    async ({
      data,
      addressData,
    }: {
      data: ADMIN_WAREHOUSES_POST_YUP_SCHEMA_TYPE;
      addressData: ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_SCHEMA_TYPE;
    }) => {
      try {
        setLoading(true);

        let shouldUpdateList = ["ward", "district", "province"];

        shouldUpdateList.forEach((key) => {
          if (!isEmpty(addressData[key])) {
            set(addressData, key, get(addressData[key], "[0]"));
          } else {
            set(addressData, key, "");
          }
        });

        const { data: resData } = await axios.post(WAREHOUSE, data);

        const warehouseId = get(resData, "id");

        if (warehouseId) {
          set(addressData, "warehouse", warehouseId);
          await axios.post(WAREHOUSE_ADDRESS, addressData);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "kho",
            })
          );
          router.replace(`/${WAREHOUSES}`);
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
          title={messages["createWarehouse"]}
          cardBodyComponent={() => {
            return (
              <Fragment>
                <WarehouseForm
                  {...{
                    control: warehouseControl,
                  }}
                />
                <WarehouseAddressForm
                  {...{
                    control: warehouseAddressControl,
                    watch: warehouseAddressWatch,
                    setValue: warehouseAddressSetValue,
                  }}
                />
              </Fragment>
            );
          }}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${WAREHOUSES}`} disabled={loading} />

          <LoadingButton
            loading={loading}
            onClick={warehouseHandleSubmit((data) => {
              warehouseAddressHandleSubmit(
                (addressData) => {
                  onSubmit({ data, addressData });
                },
                (err) => {}
              )();
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateWarehouse;
