import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { useCallback, useState, useMemo, useEffect } from "react";

import get from "lodash/get";
import set from "lodash/set";
import pick from "lodash/pick";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";

import { transformUrl } from "libs";
import { CUSTOMERS, TYPE } from "routes";
import { transformCustomerTypeData } from "./utils";
import { usePermission, useNotification } from "hooks";
import { Card, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import CustomerTypeForm from "./components/CustomerTypeForm";

import {
  ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const EditType = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [defaultValues, setDefaultValues] =
    useState<ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE>();

  const { data: rootData, mutate: rootMutate } =
    useSWR<ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        use_cache: false,
        nested_depth: 3,
      };
      return transformUrl(`${ADMIN_CUSTOMERS_TYPES_END_POINT}${id}`, params);
    });

  const { data: cusomterTypeData, mutate: customerTypeMutate } = useSWR<
    ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE[]
  >(() => {
    const params = {
      get_all: true,
      nested_depth: 1,
      use_cache: false,
    };
    return transformUrl(ADMIN_CUSTOMERS_TYPES_END_POINT, params);
  });

  useEffect(() => {
    if (rootData) {
      const body = pick(rootData, [
        ...Object.keys(ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE),
        "id",
      ]) as ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE;

      setDefaultValues(body);
    }
  }, [rootData]);

  useEffect(() => {
    if (cusomterTypeData == undefined || isEmpty(defaultValues)) return;
    const parentId = get(defaultValues, "parent");

    if (isReady) return;

    if (typeof parentId === "object" || parentId == null) {
      setIsReady(true);
      return;
    }

    const idx = cusomterTypeData.findIndex((el) => {
      return router.query.id === parentId;
    });

    if (idx > -1) {
      setDefaultValues((prev) => {
        if (prev == undefined) {
          return prev;
        }

        return {
          ...prev,
          parent: cusomterTypeData[idx],
        };
      });
    }

    setIsReady(true);
  }, [cusomterTypeData, defaultValues, isReady]);

  const transformedData = useMemo(() => {
    return transformCustomerTypeData(cusomterTypeData as any);
  }, [cusomterTypeData]);

  const onSuccessHandler = useCallback(async () => {
    await rootMutate();
    await customerTypeMutate();

    router.replace(`/${CUSTOMERS}/${TYPE}`);
  }, []);

  if (defaultValues == undefined || transformedData == undefined || !isReady) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        router,
        defaultValues,
        transformedData,
        onSuccessHandler,
      }}
    />
  );
};

type RootComponentProps = {
  defaultValues: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE;
  transformedData: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE[];
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({
  defaultValues,
  transformedData,
  onSuccessHandler,
}: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_customer_type");

  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    // resolver: customerTypeSchema(),
    resolver: ADMIN_CUSTOMERS_TYPES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          let body = {};

          Object.keys(dirtyFields).forEach((key) => {
            set(body, key, data[key]);
          });

          if (has(body, "parent")) {
            let parentId = get(body, "parent.id", null);
            set(body, "parent", parentId);
          }

          const customerTypeId = get(data, "id");

          await axios.patch(`${ADMIN_CUSTOMERS_TYPES_END_POINT}${customerTypeId}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "nhóm khách hàng",
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
      <Grid item xs={9}>
        <Card
          title={messages["updateCustomerType"]}
          body={<CustomerTypeForm control={control} customerTypeData={transformedData} />}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton
            {...{
              pathname: `/${CUSTOMERS}/${TYPE}`,
            }}
          />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
                onClick: handleSubmit((data) => {
                  onSubmit({
                    data,
                    dirtyFields,
                  });
                }),
                children: loading ? messages["updatingStatus"] : messages["updateStatus"],
              }}
            />
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditType;
