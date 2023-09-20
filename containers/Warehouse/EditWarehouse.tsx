import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect, Fragment } from "react";

import get from "lodash/get";
import set from "lodash/set";
import pick from "lodash/pick";
import isEmpty from "lodash/isEmpty";

import { Grid, Stack } from "@mui/material";

import WarehouseAddressForm from "./components/WarehouseAddressForm";
import { transformUrl, convertValueToTupleForAddress } from "libs";
import WarehouseForm from "./components/WarehouseForm";
import { WAREHOUSE, WAREHOUSE_ADDRESS } from "apis";
import DynamicMessage from "messages";
import { usePermission } from "hooks";
import { WAREHOUSES } from "routes";
import axios from "axios.config";

import {
  FailToLoad,
  Card,
  LoadingButton,
  BackButton,
  LoadingDynamic as Loading,
} from "components";

import {
  warehouseSchema,
  warehouseAddressSchema,
  defaultWarehouseAddressFormState,
  defaultWarehouseFormState,
  WarehouseSchemaProps,
  WarehouseAddressSchemaProps,
} from "yups";
import {
  ADMIN_WAREHOUSES_ADDRESSES_POST_YUP_RESOLVER,
  ADMIN_WAREHOUSES_POST_YUP_RESOLVER,
} from "__generated__/POST_YUP";

const EditWarehouse = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const [defaultValues, setDefaultValues] = useState<WarehouseSchemaProps>();
  const [defaultAddressValues, setDefaultAddressValues] =
    useState<WarehouseAddressSchemaProps>();

  let {
    data: warehouseData,
    error: warehouseError,
    mutate: warehouseMutate,
  } = useSWR(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };
    return transformUrl(`${WAREHOUSE}${id}`, params);
  });

  useEffect(() => {
    if (warehouseData == undefined) return;

    const data = pick(warehouseData, [
      ...Object.keys(defaultWarehouseFormState()),
      "id",
    ]) as WarehouseSchemaProps;

    setDefaultValues(data);

    const primaryAddress = get(warehouseData, "primary_address");

    if (!isEmpty(primaryAddress)) {
      let addressData = pick(primaryAddress, [
        ...Object.keys(defaultWarehouseAddressFormState()),
        "id",
      ]) as WarehouseAddressSchemaProps;

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
  }, [warehouseData]);

  const onSuccessHandler = useCallback(async () => {
    warehouseMutate();

    router.replace(`/${WAREHOUSES}`);
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
  defaultValues: WarehouseSchemaProps;
  defaultAddressValues: WarehouseAddressSchemaProps;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({
  defaultValues,
  defaultAddressValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { formatMessage, messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_warehouse");

  const {
    control: warehouseControl,
    handleSubmit: warehouseHandleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: warehouseSchema(),
    resolver: ADMIN_WAREHOUSES_POST_YUP_RESOLVER,
  });

  const {
    control: warehouseAddressControl,
    handleSubmit: warehouseAddressHandleSubmit,
    watch: warehouseAddressWatch,
    setValue: warehouseAddressSetValue,
    formState: { dirtyFields: warehouseAddressDirtyFields },
  } = useForm({
    defaultValues: defaultAddressValues,
    resolver: warehouseAddressSchema(),
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
      addressData,
      addressDirtyFields,
    }: {
      data: WarehouseSchemaProps;
      dirtyFields: object;
      addressData: WarehouseAddressSchemaProps;
      addressDirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const warehouseId = get(data, "id");

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${WAREHOUSE}${warehouseId}/`, body);
        }

        if (!isEmpty(addressDirtyFields)) {
          let shouldUpdateList = ["ward", "district", "province"];

          shouldUpdateList.forEach((key) => {
            if (!isEmpty(addressData[key])) {
              set(addressData, key, get(addressData[key], "[0]]"));
            } else {
              set(addressData, key, "");
            }
          });

          const warehouseAddressId = get(addressData, "id");

          let body = pick(addressData, Object.keys(addressDirtyFields));

          await axios.patch(`${WAREHOUSE_ADDRESS}${warehouseAddressId}/`, body);
        }

        enqueueSnackbar(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "kho",
          }),
          {
            variant: "success",
          }
        );

        setTimeout(onSuccessHandler, 0);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["updateWarehouse"]}
          body={
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
          }
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${WAREHOUSES}`} />
          {writePermission && (
            <LoadingButton
              {...{
                loading: loading,
                onClick: warehouseHandleSubmit((data) => {
                  warehouseAddressHandleSubmit((addressData) => {
                    onSubmit({
                      data,
                      dirtyFields,
                      addressData,
                      addressDirtyFields: warehouseAddressDirtyFields,
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

export default EditWarehouse;
