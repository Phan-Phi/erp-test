import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, Fragment, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import useSWR from "swr";
import { get, set, chunk, isEmpty } from "lodash";
import { Box, Grid, Stack, Button, MenuItem, Autocomplete } from "@mui/material";

import {
  Card,
  NoData,
  BackButton,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";

import ImageThumbList from "./components/ImageThumbList";
import ImageUploadBox from "./components/ImageUploadBox";
import { FormControl, InputForAutocomplete } from "compositions";

import {
  IImage,
  productImageSchema,
  defaultProductImageFormState,
  connectProductWithCategorySchema,
  defaultConnectProductWithCategoryFormState,
} from "yups";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { PRODUCTS, TYPE, CREATE, VARIANT } from "routes";
import { transformUrl, createRequest, checkResArr } from "libs";

import {
  ADMIN_PRODUCTS_POST_YUP_RESOLVER,
  ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_PRODUCTS_END_POINT,
  ADMIN_PRODUCTS_TYPES_END_POINT,
  ADMIN_PRODUCTS_IMAGES_END_POINT,
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_PRODUCTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const Category = dynamic(() => import("./components/Category"), {
  loading: () => {
    return <Loading />;
  },
});

const Checkbox = dynamic(() => import("./components/Checkbox"), {
  loading: () => {
    return <Loading />;
  },
});

const ProductCategory = () => {
  const router = useRouter();
  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { control, handleSubmit } = useForm({
    defaultValues: { ...ADMIN_PRODUCTS_POST_DEFAULT_VALUE },
    resolver: ADMIN_PRODUCTS_POST_YUP_RESOLVER,
  });

  const { control: productCategoryControl, handleSubmit: productCategoryHandleSubmit } =
    useForm({
      resolver: connectProductWithCategorySchema(),
      defaultValues: defaultConnectProductWithCategoryFormState(),
    });

  const { control: productImageControl, handleSubmit: productImageHandleSubmit } =
    useForm({
      resolver: productImageSchema(),
      defaultValues: defaultProductImageFormState(),
    });

  const { fields, append, swap, remove } = useFieldArray({
    control: productImageControl,
    name: "images",
    keyName: "formId",
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { data: productTypeData } = useSWR<ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1[]>(
    () => {
      return transformUrl(ADMIN_PRODUCTS_TYPES_END_POINT, {
        get_all: true,
      });
    }
  );

  const onSubmit = useCallback(
    async ({
      data,
      categoryData,
      imageData,
    }: {
      data: ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE;
      categoryData: ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1[];
      imageData: IImage[];
    }) => {
      setLoading(true);

      // const publicationDate = get(data, "publication_date");
      // const availableForPurchase = get(data, "available_for_purchase");

      // if (publicationDate) {
      //   set(data, "publication_date", publicationDate);
      // }

      // if (availableForPurchase) {
      //   set(data, "available_for_purchase", availableForPurchase);
      // }

      // const productClassId = get(data, "product_class.id");

      // set(data, "product_class", productClassId);

      try {
        const { data: resData } = await axios.post(ADMIN_PRODUCTS_END_POINT, data);

        const productId = get(resData, "id");
        const variantId = get(resData, "default_variant.id");

        if (productId && variantId) {
          let resList: any[] = [];

          if (!isEmpty(categoryData)) {
            const transformedCategories = categoryData.map((el) => {
              let body = {};
              set(body, "product", productId);
              set(body, "category", el.id);
              return body;
            });

            const results = await createRequest(
              ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
              transformedCategories
            );

            resList = [...resList, ...results];
          }

          if (!isEmpty(imageData)) {
            imageData = imageData.map((el, idx) => {
              return { ...el, sort_order: idx };
            });

            const chunkFileList = chunk(imageData, 5);

            for await (let arr of chunkFileList) {
              const results = await Promise.all(
                arr.map(async (file) => {
                  let formData = new FormData();
                  formData.append("product", productId);
                  formData.append("alt", file.alt);
                  formData.append("image", file.file);
                  formData.append("sort_order", file.sort_order.toString());

                  return axios.post(ADMIN_PRODUCTS_IMAGES_END_POINT, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                })
              );

              resList = [...resList, ...results];
            }
          }

          const result = checkResArr(resList);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.createSuccessfully, {
                content: "sản phẩm",
              })
            );
            router.push(`/${PRODUCTS}/${productId}/${VARIANT}/${variantId}`);
          }
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

  const children = useMemo(() => {
    if (productTypeData == undefined) {
      return (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      );
    }

    return (
      <Fragment>
        <Grid item xs={12}>
          <Checkbox control={control} />
        </Grid>
        <Grid item xs={12}>
          <Category {...{ control: productCategoryControl }} />
        </Grid>
        <Grid item xs={12}>
          <Card
            title={messages["productType"] as string}
            cardBodyComponent={() => {
              if (productTypeData.length === 0) {
                return (
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <NoData>{messages["noProductType"] as string}</NoData>

                    <Button
                      variant="contained"
                      onClick={() => {
                        let pathname = `/${PRODUCTS}/${TYPE}/${CREATE}`;

                        router.push(pathname, pathname, { shallow: true });
                      }}
                    >
                      {messages["createProductType"]}
                    </Button>
                  </Stack>
                );
              } else {
                return (
                  <Fragment>
                    <Controller
                      name="product_class"
                      control={control}
                      render={(props) => {
                        const { field, fieldState } = props;
                        const { value, onChange } = field;
                        const { error } = fieldState;

                        return (
                          <Autocomplete
                            options={productTypeData}
                            renderOption={(props, option) => {
                              return (
                                <MenuItem
                                  {...props}
                                  key={option.id}
                                  value={option.id}
                                  children={option.name}
                                />
                              );
                            }}
                            getOptionLabel={(option) => option.name}
                            value={value as any}
                            onChange={(_, value) => onChange(value)}
                            renderInput={(props) => {
                              return (
                                <InputForAutocomplete
                                  {...props}
                                  label={messages["productType"] as string}
                                  placeholder={messages["productType"] as string}
                                  error={!!error}
                                  errorMessage={error && error.message}
                                  FormControlProps={{ required: true }}
                                />
                              );
                            }}
                          />
                        );
                      }}
                    />
                  </Fragment>
                );
              }
            }}
          />
        </Grid>
      </Fragment>
    );
  }, [productTypeData]);

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
              categoryData,
              imageData: imageData as IImage[],
            });
          })();
        })();
      })}
    >
      <Grid container>
        <Grid item xs={9}>
          <Card
            title={messages["productInfo"] as string}
            body={
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="name"
                    render={(props) => {
                      return (
                        <FormControl
                          controlState={props}
                          label={messages["productName"] as string}
                          placeholder={messages["productName"] as string}
                          FormControlProps={{ required: true }}
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="description"
                    render={(props) => {
                      return (
                        <FormControl
                          controlState={props}
                          label={messages["productDescription"] as string}
                          placeholder={messages["productDescription"] as string}
                          InputProps={{
                            rows: 5,
                            multiline: true,
                            sx: {
                              padding: 1,
                            },
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploadBox
                    onDrop={(acceptedFiles) => {
                      acceptedFiles.forEach((el, idx) => {
                        const { name } = el;

                        append({
                          file: el,
                          alt: name,
                          sort_order: fields.length + idx,
                        });
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageThumbList
                    {...{
                      data: fields,
                      swap,
                      remove,
                    }}
                  />
                </Grid>
              </Grid>
            }
          />
        </Grid>

        <Grid item xs={3}>
          <Grid container>{children}</Grid>
        </Grid>

        <Grid item xs={12}>
          <Stack flexDirection="row" justifyContent="flex-end" columnGap={2}>
            <BackButton pathname={`/${PRODUCTS}`} disabled={loading} />
            <LoadingButton loading={loading} type="submit">
              {loading ? messages["creatingStatus"] : messages["createStatus"]}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductCategory;
