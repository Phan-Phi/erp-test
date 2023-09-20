import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import useSWR from "swr";
import { get, set, pick, isEmpty } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import Checkbox from "./components/Checkbox";
import GeneralInfo from "./components/GeneralInfoForVariant";
import { LoadingDynamic as Loading, LoadingButton, BackButton } from "components";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { transformUrl, checkResArr } from "libs";
import { useNotification, usePermission } from "hooks";

import {
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const VariantList = dynamic(() => import("./components/VariantList"), {
  loading: () => {
    return <Loading />;
  },
});

const Stock = dynamic(() => import("./components/Stock"), {
  loading: () => {
    return <Loading />;
  },
});
const ExtendUnit = dynamic(() => import("./components/ExtendUnit"), {
  loading: () => {
    return <Loading />;
  },
});

const VariantDetail = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>();
  // const [defaultAttributeValues, setDefaultAttributeValues] = useState();

  const { data: variantData, mutate: variantMutate } =
    useSWR<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(() => {
      const variantId = router.query.variantId;

      if (variantId) {
        return transformUrl(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`, {
          use_cache: false,
        });
      }
    });

  // const { data: variantAttributeData, mutate: variantAttributeMutate } = useSWR(() => {
  //   const variantId = router.query.variantId;
  //   if (variantId) {
  //     return transformUrl(PRODUCT_TYPE_VARIANT_ATTRIBUTE_VALUE, {
  //       variant: variantId,
  //       get_all: true,
  //       use_cache: false,
  //     });
  //   }
  // });

  useEffect(() => {
    if (variantData == undefined) {
      return;
    }

    const keyList = [
      "id",
      "name",
      "unit",
      "bar_code",
      "is_default",
      "editable_sku",
      "list_id_values",
      "track_inventory",
    ];

    const data: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
      {} as ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;

    for (const key of keyList) {
      data[key] = variantData[key];
    }

    const priceInclTax: string = get(variantData, "price.incl_tax");
    const priceForDisplay: string = get(variantData, "price.excl_tax");

    const weightValue: number = get(variantData, "weight.weight");

    set(data, "price_incl_tax", parseFloat(priceInclTax).toString());
    set(data, "priceForDisplay", parseFloat(priceForDisplay).toString());
    set(data, "weight", weightValue.toString());
    set(data, "list_id_values", "-");

    setDefaultValues(data);
  }, [variantData, router]);

  // useEffect(() => {
  //   if (variantAttributeData == undefined) {
  //     return;
  //   }

  //   setDefaultAttributeValues(variantAttributeData);
  // }, [variantAttributeData]);

  const onSuccessHandler = useCallback(async () => {
    // setDefaultValues(undefined);
    // setDefaultAttributeValues(undefined);

    await variantMutate();
    // const variantAttributeData = await variantAttributeMutate();
    router.replace(`/${PRODUCTS}/${router.query.id}`);

    // const data = pick(variantData, [
    //   ...Object.keys(defaultProductVariantFormState()),
    //   "id",
    // ]);

    // const priceValue = get(data, "price.excl_tax");
    // const priceForDisplay = get(data, "price.incl_tax");
    // const weightValue = get(data, "weight.weight");
    // set(data, "price", parseFloat(priceValue));
    // set(data, "priceForDisplay", parseFloat(priceForDisplay));
    // set(data, "weight", weightValue);

    // setDefaultValues(data);
    // setDefaultAttributeValues(variantAttributeData);
  }, []);

  const selectVariantHandler = useCallback(() => {
    setDefaultValues(undefined);
    // setDefaultAttributeValues(undefined);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent
      {...{
        defaultValues,
        onSuccessHandler,
        // defaultAttributeValues,
        selectVariantHandler,
      }}
    />
  );
};

interface RootComponentProps {
  defaultValues: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
  selectVariantHandler: () => void;
}

const RootComponent = ({
  defaultValues,
  // defaultAttributeValues,
  onSuccessHandler,
  selectVariantHandler,
}: RootComponentProps) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_product");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  // const {
  //   control: variantAttributeValueControl,
  //   handleSubmit: variantAttributeValueHandleSubmit,
  // } = useForm({
  //   defaultValues: {
  //     attributes: defaultAttributeValues,
  //   },
  //   resolver: variantAttributeValueSchema(),
  // });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      const variantId = get(data, "id");

      try {
        setLoading(true);

        let resList = [];

        if (!isEmpty(dirtyFields)) {
          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}/`, body);
        }

        // * update attribute

        // const updateAttributeData = differenceWith(
        //   attributeData,
        //   originalAttributeData,
        //   (el1, el2) => {
        //     const compareKeyList = ["values"];

        //     const obj1 = pick(el1, compareKeyList);
        //     const obj2 = pick(el2, compareKeyList);

        //     return isEqual(obj1, obj2);
        //   }
        // );

        // if (!isEmpty(updateAttributeData)) {
        //   const transformedUpdataAttributeData = updateAttributeData.map((el) => {
        //     let values = el.values;

        //     if (values?.[0] == "") {
        //       values = [];
        //     }

        //     return {
        //       id: el.id,
        //       values,
        //     };
        //   });

        //   const results = await updateRequest(
        //     PRODUCT_TYPE_VARIANT_ATTRIBUTE_VALUE,
        //     transformedUpdataAttributeData
        //   );

        //   resList = [...resList, ...results];
        // }

        const result = checkResArr(resList);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "sản phẩm",
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
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        onSubmit({
          data,
          dirtyFields,
          // attributeData,
          // originalAttributeData: defaultAttributeValues,
        });

        // variantAttributeValueHandleSubmit((variantAttributeValueData) => {
        //   const { attributes: attributeData } = variantAttributeValueData;
        // })();
      })}
    >
      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={12}>
              <GeneralInfo
                {...{
                  control,
                  defaultValues,
                }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Attribute control={variantAttributeValueControl} />
            </Grid> */}

            <Grid item xs={12}>
              <Stock />
            </Grid>
            <Grid item xs={12}>
              <ExtendUnit />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Checkbox control={control} />
            </Grid>

            <Grid item xs={12}>
              <VariantList selectVariantHandler={selectVariantHandler} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <BackButton
              onClick={() => {
                if (router.query.variantId) {
                  let pathname = `/${PRODUCTS}/${router.query.id}`;

                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                } else {
                  let pathname = `/${PRODUCTS}`;

                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                }
              }}
            />
            <Stack direction="row" spacing={2}>
              {writePermission && (
                <LoadingButton loading={loading} type="submit">
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VariantDetail;
