import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import useSWR from "swr";
import { Grid, Stack } from "@mui/material";
import { get, set, pick, isEmpty } from "lodash";

import ProductTypeForm from "./components/ProductTypeForm";
import { BackButton, LoadingButton, Card, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { PRODUCTS, TYPE } from "routes";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_PRODUCTS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

export interface DEFAULT_VALUES_EXTENDS_TYPE
  extends ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE {
  tax_rate: any;
}

const EditType = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<DEFAULT_VALUES_EXTENDS_TYPE>();

  const { data: productTypeData, mutate: productTypeMutate } =
    useSWR<ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1>(() => {
      let id = router.query.id;

      if (id == undefined) return;

      const params = {
        use_cache: false,
      };
      return transformUrl(`${ADMIN_PRODUCTS_TYPES_END_POINT}${id}`, params);
    });

  useEffect(() => {
    if (productTypeData == undefined) return;

    const data = pick(productTypeData, [
      ...Object.keys(ADMIN_PRODUCTS_TYPES_POST_DEFAULT_VALUE),
      "id",
    ]) as DEFAULT_VALUES_EXTENDS_TYPE;

    set(data, "tax_rate", parseFloat(get(data, "tax_rate")) * 100);

    setDefaultValues(data);
  }, [productTypeData]);

  const onSuccessHandler = useCallback(async () => {
    await productTypeMutate();

    router.replace(`/${PRODUCTS}/${TYPE}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};
type RootComponentProps = {
  defaultValues: DEFAULT_VALUES_EXTENDS_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { hasPermission: writePermission } = usePermission("write_product_class");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_PRODUCTS_TYPES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: DEFAULT_VALUES_EXTENDS_TYPE;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const { id } = data;

          const taxRate = get(data, "tax_rate");

          if (taxRate) {
            const transformedTaxRate = parseFloat(taxRate) / 100;

            set(data, "tax_rate", transformedTaxRate);
          }

          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_PRODUCTS_TYPES_END_POINT}${id}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "loại sản phẩm",
            })
          );
        }
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
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["updateProductClass"]}
          body={<ProductTypeForm control={control} />}
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PRODUCTS}/${TYPE}`} />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
                onClick: handleSubmit((data) => {
                  onSubmit({ data, dirtyFields });
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
