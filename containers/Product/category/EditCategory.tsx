import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import { Grid, Stack } from "@mui/material";
import { get, set, pick, isEmpty } from "lodash";

import {
  Card,
  FailToLoad,
  BackButton,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import CategoryForm from "./components/CategoryForm";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { CATEGORY, PRODUCTS } from "routes";
import { usePermission, useNotification } from "hooks";
import {
  ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";

export interface DEFAULT_VALUES_EXTENDS_TYPE
  extends ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_SCHEMA_TYPE {}

const EditCategory = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<DEFAULT_VALUES_EXTENDS_TYPE>();
  const [isReady, setIsReady] = useState(false);

  const {
    data: productCategoryData,
    error: productCategoryError,
    mutate: productCategoryMutate,
  } = useSWR(() => {
    let id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${ADMIN_PRODUCTS_CATEGORIES_END_POINT}${id}`, params);
  });

  const { data: parentData } = useSWR(() => {
    if (isReady) return;

    const parentId = get(defaultValues, "parent");

    if (typeof parentId !== "object" && parentId !== undefined) {
      return `${ADMIN_PRODUCTS_CATEGORIES_END_POINT}${parentId}`;
    }
  });

  useEffect(() => {
    if (productCategoryData == undefined) return;

    let data = pick(productCategoryData, [
      ...Object.keys(ADMIN_CUSTOMERS_TYPES_POST_DEFAULT_VALUE),
      "id",
    ]) as DEFAULT_VALUES_EXTENDS_TYPE;

    const hasParent = get(productCategoryData, "parent");

    setDefaultValues(data);

    if (!hasParent) {
      setIsReady(true);
    }
  }, [productCategoryData]);

  useEffect(() => {
    if (parentData == undefined) return;

    setDefaultValues((prev) => {
      if (prev == undefined) {
        return prev;
      }

      return { ...prev, parent: parentData };
    });

    setIsReady(true);
  }, [parentData]);

  const onSuccessHandler = useCallback(async () => {
    await productCategoryMutate();
    router.replace(`/${PRODUCTS}/${CATEGORY}`);
  }, []);

  if (productCategoryError) return <FailToLoad />;

  if (defaultValues == undefined || !isReady) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

type RootComponentProps = {
  defaultValues: DEFAULT_VALUES_EXTENDS_TYPE;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_category");

  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();
  const isMounted = useMountedState();

  const {
    control,
    handleSubmit,

    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_CUSTOMERS_TYPES_WITH_ID_PATCH_YUP_RESOLVER,
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
        if (!isEmpty(dirtyFields)) {
          const { id: productCategoryId } = data;

          setLoading(true);

          set(data, "parent", get(data, "parent", null));
          let body = pick(data, Object.keys(dirtyFields));

          await axios.patch(
            `${ADMIN_PRODUCTS_CATEGORIES_END_POINT}${productCategoryId}/`,
            body
          );

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "danh mục",
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
          title={messages["updateProductCategory"]}
          body={<CategoryForm control={control} />}
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${PRODUCTS}/${CATEGORY}`} />
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

export default EditCategory;
