import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState, useEffect } from "react";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import {
  get,
  set,
  pick,
  chunk,
  unset,
  isEqual,
  isEmpty,
  cloneDeep,
  differenceWith,
} from "lodash";
import useSWR from "swr";
import { boolean, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Stack, Button } from "@mui/material";

import Checkbox from "./components/Checkbox";
// import Attribute from "./components/Attribute";
import GeneralInfoForProduct from "./components/GeneralInfoForProduct";
import ContainerRecommendation from "./recommendations/ContainerRecommendation";
import { LoadingDynamic as Loading, LoadingButton, BackButton, Card } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { PRODUCTS, VARIANT } from "routes";
import { PRODUCT_IMAGE_ITEM } from "interfaces";
import { useNotification, usePermission } from "hooks";
import { createRequest, deleteRequest, transformUrl, checkResArr } from "libs";

import {
  productImageSchema,
  ProductImageSchemaProps,
  connectProductWithCategorySchema,
  ConnectProductWithCategorySchemaProps,
} from "yups";

import {
  ADMIN_PRODUCTS_WITH_ID_PATCH_SHAPE,
  ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import {
  ADMIN_PRODUCTS_END_POINT,
  ADMIN_PRODUCTS_IMAGES_END_POINT,
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
} from "__generated__/END_POINT";

import { ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const VariantTable = dynamic(() => import("./VariantTable"), {
  loading: () => {
    return <Loading />;
  },
});

const Category = dynamic(() => import("./components/Category"), {
  loading: () => {
    return <Loading />;
  },
});

export interface DATA_PRODUCT_EXTEND
  extends ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE {
  stop_business?: boolean;
}

const ProductDetail = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<DATA_PRODUCT_EXTEND>();

  const [defaultImageValues, setDefaultImageValues] = useState<ProductImageSchemaProps>();

  const [defalutCategoryValues, setDefalutCategoryValues] =
    useState<ConnectProductWithCategorySchemaProps>();

  // const [defaultAttributeValues, setDefaultAttributeValues] = useState();

  const { data: productData, mutate: productMutate } =
    useSWR<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      return transformUrl(`${ADMIN_PRODUCTS_END_POINT}${id}`, {
        use_cache: false,
      });
    });

  // const { data: productAttributeData, mutate: productAttributeMutate } = useSWR<
  //   PRODUCT_TYPE_PRODUCT_ATTRIBUTE_VALUE_ITEM[]
  // >(() => {
  //   const productId = router.query.id;
  //   if (productId) {
  //     return transformUrl(PRODUCT_TYPE_PRODUCT_ATTRIBUTE_VALUE, {
  //       product: productId,
  //       get_all: true,
  //       use_cache: false,
  //     });
  //   }
  // });

  const { data: selectedCategoryData, mutate: selectedCategoryMutate } = useSWR<any[]>(
    () => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        get_all: true,
        product: id,
        use_cache: false,
      };

      return transformUrl(ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT, params);
    }
  );

  const { data: productImageData, mutate: productImageMutate } = useSWR<
    PRODUCT_IMAGE_ITEM[]
  >(() => {
    const id = router.query.id;

    if (id) {
      const params = {
        get_all: true,
        product: id,
        use_cache: false,
      };

      return transformUrl(ADMIN_PRODUCTS_IMAGES_END_POINT, params);
    }
  });

  useEffect(() => {
    if (productData == undefined) {
      return;
    }

    const data = {} as any;

    const keyList = [
      ...Object.keys(ADMIN_PRODUCTS_POST_DEFAULT_VALUE),
      "id",
      "default_variant",
    ];

    keyList.forEach((key) => {
      set(data, key, productData[key]);
    });

    const overrideData = {
      ...data,
      stop_business: get(productData, "available_for_purchase") === null ? true : false,
    };

    setDefaultValues(overrideData);
  }, [productData]);

  useEffect(() => {
    if (productImageData == undefined) {
      return;
    }

    const transformedProductImageData = productImageData.map((el) => {
      return {
        alt: el.alt,
        file: el.image.product_list,
        sort_order: el.sort_order,
        id: el.id,
      };
    });

    setDefaultImageValues({
      images: transformedProductImageData,
    });
  }, [productImageData]);

  useEffect(() => {
    if (selectedCategoryData == undefined) {
      return;
    }

    const data = selectedCategoryData.map((el) => {
      return { ...el.category, connectId: el.id };
    });

    setDefalutCategoryValues({
      categories: data,
    });
  }, [selectedCategoryData]);

  // useEffect(() => {
  //   if (productAttributeData == undefined) {
  //     return;
  //   }

  //   setDefaultAttributeValues(productAttributeData);
  // }, [productAttributeData]);

  const onSuccessHandler = useCallback(async () => {
    // setDefaultValues(undefined);
    // setDefaultImageValues(undefined);
    // setDefalutCategoryValues(undefined);

    const productData = productMutate();

    // const productAttributeData = await productAttributeMutate();
    const productCategoryData = selectedCategoryMutate();
    const productImageData = productImageMutate();

    router.replace(`/${PRODUCTS}`);
    // const data = pick(productData, [...Object.keys(defaultProductFormState()), "id"]);

    // const categories = productCategoryData.map((el) => {
    //   return { ...el.category, connectId: el.id };
    // });

    // setDefaultValues(data);
    // setDefalutCategoryValues(categories);
    // setDefaultImageValues(productImageData);
    // setDefaultAttributeValues(productAttributeData);
  }, []);

  if (
    defaultValues == undefined ||
    defalutCategoryValues == undefined ||
    defaultImageValues == undefined
  ) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultValues,
        defalutCategoryValues,
        defaultImageValues,
        onSuccessHandler,
      }}
    />
  );
};

type RootComponentProps = {
  defaultValues: DATA_PRODUCT_EXTEND;
  defalutCategoryValues: ConnectProductWithCategorySchemaProps;
  defaultImageValues: ProductImageSchemaProps;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({
  defaultValues,
  defalutCategoryValues,
  defaultImageValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const { hasPermission: writePermission } = usePermission("write_product");

  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const ADMIN_PRODUCTS_PATCH_SHAPE_EXTENDS = Object.assign(
    ADMIN_PRODUCTS_WITH_ID_PATCH_SHAPE,
    {
      stop_business: boolean().notRequired(),
    }
  );

  const ADMIN_PRODUCTS_PATCH_YUP_SCHEMA_EXTENDS = object({}).shape(
    ADMIN_PRODUCTS_PATCH_SHAPE_EXTENDS
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: yupResolver(ADMIN_PRODUCTS_PATCH_YUP_SCHEMA_EXTENDS),

    // resolver: ADMIN_PRODUCTS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  // const {
  //   control: productAttributeValueControl,
  //   handleSubmit: productAttributeValueHandleSubmit,
  // } = useForm({
  //   defaultValues: {
  //     attributes: defaultAttributeValues,
  //   },
  //   resolver: productAttributeValueSchema(),
  // });

  const { control: productCategoryControl, handleSubmit: productCategoryHandleSubmit } =
    useForm({
      defaultValues: defalutCategoryValues,
      resolver: connectProductWithCategorySchema(),
    });

  const { control: productImageControl, handleSubmit: productImageHandleSubmit } =
    useForm({
      defaultValues: defaultImageValues,
      resolver: productImageSchema(),
    });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
      categoryData,
      originalCategoryData,
      imageData,
      originalImageData,
    }: {
      data: DATA_PRODUCT_EXTEND;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
      categoryData: ConnectProductWithCategorySchemaProps["categories"];
      originalCategoryData: ConnectProductWithCategorySchemaProps["categories"];
      imageData: ProductImageSchemaProps["images"];
      originalImageData: ProductImageSchemaProps["images"];
    }) => {
      try {
        const productId = get(data, "id");

        // use for productSchema(): start
        // if (get(data, "available_for_purchase")) {
        //   set(
        //     data,
        //     "available_for_purchase",
        //     new Date(get(data, "available_for_purchase") as any).toISOString()
        //   );
        // }

        // if (get(data, "publication_date")) {
        //   set(
        //     data,
        //     "publication_date",
        //     new Date(get(data, "publication_date") as any).toISOString()
        //   );
        // }

        // if (get(data, "product_class")) {
        //   set(data, "product_class", get(data, "product_class.id"));
        // }

        const cloneData = cloneDeep(data);

        if (get(data, "stop_business")) {
          set(data, "available_for_purchase", null);
        }

        unset(data, "stop_business");

        setLoading(true);

        let resList: any[] = [];

        if (!isEmpty(dirtyFields) || isEmpty(cloneData.stop_business)) {
          const body = pick(data, Object.keys(dirtyFields));

          const overrideBody = {
            ...body,
            available_for_purchase:
              cloneData.stop_business === true ? null : cloneData.available_for_purchase,
          };

          await axios.patch(`${ADMIN_PRODUCTS_END_POINT}${productId}/`, overrideBody);
        }

        // * HANDLE PRODUCT ATTRIBUTE

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

        // const chunkAttribute = chunk(Object.values(updateAttributeData), 5);

        // for await (let arr of chunkAttribute) {
        //   const results = await Promise.all(
        //     arr.map(async (el) => {
        //       let { id, values } = el;

        //       if (values?.[0] === "") {
        //         values = [];
        //       }

        //       return axios.patch(`${PRODUCT_TYPE_PRODUCT_ATTRIBUTE_VALUE}${id}/`, {
        //         values,
        //       });
        //     })
        //   );

        //   resList = [...resList, ...results];
        // }

        // * HANDLE PRODUCT CATEGORY

        const newCategoryList = differenceWith(
          categoryData,
          originalCategoryData,
          (el1, el2) => {
            return el1.id === el2.id;
          }
        );

        const deleteCategoryList = differenceWith(
          originalCategoryData,
          categoryData,
          (el1, el2) => {
            return el1.id === el2.id;
          }
        );

        if (!isEmpty(newCategoryList)) {
          const transformedNewCategoryList = newCategoryList.map((el) => {
            return {
              category: el.id,
              product: productId,
            };
          });

          const results = await createRequest(
            ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
            transformedNewCategoryList
          );

          resList = [...resList, ...results];
        }

        if (!isEmpty(deleteCategoryList)) {
          const transformedDeleteCategoryList = deleteCategoryList.map((el) => {
            return el.connectId;
          });

          const results = await deleteRequest(
            ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
            transformedDeleteCategoryList
          );

          resList = [...resList, ...results];
        }

        // * HANDLE PRODUCT IMAGE

        imageData = imageData.map((el, idx) => {
          return { ...el, sort_order: idx };
        });

        const chunkImageData = chunk(imageData, 5);

        for await (let list of chunkImageData) {
          const results = await Promise.all(
            list.map(async (el, idx) => {
              if (el.file instanceof File) {
                const formData = new FormData();

                if (productId) {
                  formData.append("image", el.file);
                  formData.append("product", productId?.toString());
                  formData.append("sort_order", el.sort_order.toString());
                  formData.append("alt", el.alt || "");

                  return axios.post(ADMIN_PRODUCTS_IMAGES_END_POINT, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                }
              } else if (el.id) {
                return axios.patch(`${ADMIN_PRODUCTS_IMAGES_END_POINT}${el.id}/`, {
                  sort_order: el.sort_order,
                });
              }
            })
          );

          resList = [...resList, ...results];
        }

        const deleteImageData = differenceWith(
          originalImageData,
          imageData,
          (el1, el2) => {
            const compareKeyList = ["id"];

            const obj1 = pick(el1, compareKeyList);
            const obj2 = pick(el2, compareKeyList);

            return isEqual(obj1, obj2);
          }
        );

        if (!isEmpty(deleteImageData)) {
          const transformedDeleteImageData = deleteImageData.map((el) => {
            return el.id;
          });

          const results = await deleteRequest(
            ADMIN_PRODUCTS_IMAGES_END_POINT,
            transformedDeleteImageData
          );

          resList = [...resList, ...results];
        }

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
        productCategoryHandleSubmit((productCategoryData) => {
          const { categories: categoryData } = productCategoryData;

          productImageHandleSubmit((productImageData) => {
            const { images: imageData } = productImageData;

            onSubmit({
              data,
              dirtyFields,
              categoryData,
              originalCategoryData: defalutCategoryValues["categories"],
              imageData,
              originalImageData: defaultImageValues["images"],
            });
          })();
        })();

        // productAttributeValueHandleSubmit((productAttributeValueData) => {
        //   const { attributes: attributeData } = productAttributeValueData;

        // })();
      })}
    >
      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <GeneralInfoForProduct
              {...{
                control,
                productImageControl,
              }}
            />

            <Grid item xs={12}>
              <VariantTable defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Checkbox {...{ control, setValue }} />
            </Grid>

            <Grid item xs={12}>
              <Category {...{ control: productCategoryControl }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ContainerRecommendation />
        </Grid>

        <Grid item xs={12}>
          <Stack flexDirection="row" justifyContent="space-between">
            <BackButton
              onClick={() => {
                let pathname = `/${PRODUCTS}`;

                router.push(pathname, pathname, {
                  shallow: true,
                });
              }}
              disabled={loading}
            />

            <Stack flexDirection="row" columnGap={2}>
              <Button
                variant="outlined"
                disabled={loading}
                onClick={() => {
                  const productId = get(defaultValues, "id");
                  const variantId = get(defaultValues, "default_variant.id");

                  const pathname = `/${PRODUCTS}/${productId}/${VARIANT}/${variantId}`;

                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                }}
              >
                {messages["updateVariant"]}
              </Button>

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

export default ProductDetail;
