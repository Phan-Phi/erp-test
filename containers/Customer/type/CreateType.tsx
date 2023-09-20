import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useMemo, useCallback } from "react";

import useSWR from "swr";
import get from "lodash/get";
import set from "lodash/set";

import { CUSTOMERS, TYPE } from "routes";
import { Card, LoadingDynamic as Loading, LoadingButton, BackButton } from "components";

import {
  customerTypeSchema,
  defaultCustomerTypeFormState,
  CustomerTypeSchemaProps,
} from "yups";

import CustomerTypeForm from "./components/CustomerTypeForm";
import DynamicMessage from "messages";
import { transformCustomerTypeData } from "./utils";
import { useNotification } from "hooks";
import { transformUrl } from "libs";
import { CUSTOMER_TYPE } from "apis";
import axios from "axios.config";

import { CUSTOMER_TYPE_ITEM } from "interfaces";
import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateType = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const { formatMessage, messages } = useIntl();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit } = useForm({
    // defaultValues: defaultCustomerTypeFormState(),
    // resolver: customerTypeSchema(),
    defaultValues: ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE,
    resolver: ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  });
  const { data: cusomterTypeData, mutate } = useSWR<CUSTOMER_TYPE_ITEM[]>(() => {
    const params = {
      get_all: true,
      nested_depth: 1,
      use_cache: false,
    };
    return transformUrl(ADMIN_CUSTOMERS_TYPES_END_POINT, params);
  });

  const onSubmit = useCallback(async ({ data }: { data: CustomerTypeSchemaProps }) => {
    setLoading(true);

    if (data?.parent) {
      const id = get(data, "parent.id");
      set(data, "parent", id);
    }

    try {
      await axios.post(ADMIN_CUSTOMERS_TYPES_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "nhóm khách hàng",
        })
      );

      mutate();

      router.replace(`/${CUSTOMERS}/${TYPE}`);
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const transformedData = useMemo(() => {
    return transformCustomerTypeData(cusomterTypeData);
  }, [cusomterTypeData]);

  if (transformedData === undefined) {
    return <Loading />;
  }

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["createCustomerType"]}
          body={<CustomerTypeForm control={control} customerTypeData={transformedData} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${CUSTOMERS}/${TYPE}`} />
          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              onSubmit({
                data,
              });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateType;
