import useSWR from "swr";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Fragment, useEffect, useCallback } from "react";
import { useToggle, useUpdateEffect, useMountedState } from "react-use";
import { useForm, useFieldArray, Controller, Control } from "react-hook-form";

import { Grid } from "@mui/material";
import { get, pick, isEmpty, isEqual, findIndex, differenceWith } from "lodash";

import ImageThumbList from "./ImageThumbListForVariant";
import { Card, LoadingDynamic as Loading } from "components";
import { FormControl, FormControlForNumber, InputNumber } from "compositions";

import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { PRODUCT_VARIANT_IMAGE_ITEM } from "interfaces";
import { checkResArr, createRequest, deleteRequest } from "libs";
import { useNotification, usePermission, useSetting } from "hooks";

import {
  variantImageSchema,
  VariantImageSchemaProps,
  defaultVariantImageFormState,
} from "yups";

import { ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE } from "__generated__/PATCH_YUP";
import { ADMIN_PRODUCTS_VARIANTS_IMAGES_END_POINT } from "__generated__/END_POINT";

const ImageDialog = dynamic(() => import("./ImageDialog"), {
  loading: () => {
    return <Loading />;
  },
});

type GeneralInfoProps = {
  control: any;
  defaultValues: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
};

const GeneralInfo = (props: GeneralInfoProps) => {
  const { defaultValues } = props;
  const control =
    props.control as Control<ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>;

  const { hasPermission: writePermission } = usePermission("write_product");
  const { control: variantImageControl, handleSubmit: variantImageHandleSubmit } =
    useForm({
      defaultValues: defaultVariantImageFormState(),
      resolver: variantImageSchema(),
    });

  const { fields, append, remove, replace } = useFieldArray({
    name: "images",
    control: variantImageControl,
    keyName: "formId",
  });

  const [open, toggle] = useToggle(false);
  const isMounted = useMountedState();
  const router = useRouter();
  const setting = useSetting();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const { data: variantImageData, mutate: variantImageMutate } = useSWR<
    PRODUCT_VARIANT_IMAGE_ITEM[]
  >(() => {
    if (router.query.variantId) {
      return transformUrl(ADMIN_PRODUCTS_VARIANTS_IMAGES_END_POINT, {
        variant: router.query.variantId,
        get_all: true,
        use_cache: false,
      });
    }
  });

  useEffect(() => {
    if (variantImageData == undefined) {
      return;
    }

    const data = variantImageData.map((el) => {
      return {
        connectId: el.id,
        file: el.image.image.product_list,
        sort_order: el.image.sort_order,
        alt: el.image.alt,
        id: el.image.id,
      };
    });

    replace(data);
  }, [variantImageData]);

  useUpdateEffect(() => {
    if (variantImageData == undefined) {
      return;
    }

    if (!open) {
      const data = variantImageData.map((el) => {
        return {
          connectId: el.id,
          file: el.image.image.product_list,
          sort_order: el.image.sort_order,
          alt: el.image.alt,
          id: el.image.id,
        };
      });
      replace(data);
    }
  }, [open, variantImageData]);

  const onSubmit = useCallback(
    async ({
      data,
      originalData,
    }: {
      data: VariantImageSchemaProps["images"];
      originalData: PRODUCT_VARIANT_IMAGE_ITEM[];
    }) => {
      try {
        originalData = originalData.map((el) => {
          return { ...el, connectId: el.id };
        });

        setLoading(true);

        const variantId = router.query.variantId;
        let resList: any[] = [];

        const newImageData = differenceWith(data, originalData, (el1, el2) => {
          const compareKeyList = ["connectId"];

          const obj1 = pick(el1, compareKeyList);
          const obj2 = pick(el2, compareKeyList);

          return isEqual(obj1, obj2);
        });
        const deleteImageData = differenceWith(originalData, data, (el1, el2) => {
          const compareKeyList = ["connectId"];

          const obj1 = pick(el1, compareKeyList);
          const obj2 = pick(el2, compareKeyList);

          return isEqual(obj1, obj2);
        });

        if (!isEmpty(newImageData)) {
          const transformedNewImageData = newImageData.map((el) => {
            return { variant: variantId, image: el.id };
          });

          const results = await createRequest(
            ADMIN_PRODUCTS_VARIANTS_IMAGES_END_POINT,
            transformedNewImageData
          );

          resList = [...resList, ...results];
        }

        if (!isEmpty(deleteImageData)) {
          const transformedDeleteImageData = deleteImageData.map((el) => {
            return get(el, "connectId");
          });

          const results = await deleteRequest(
            ADMIN_PRODUCTS_VARIANTS_IMAGES_END_POINT,
            transformedDeleteImageData
          );

          resList = [...resList, ...results];
        }

        const resulst = checkResArr(resList);

        if (resulst) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "hình",
            })
          );

          await variantImageMutate();
          toggle(false);
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

  const selectImageHandler = useCallback(
    (data: any) => {
      return () => {
        const idx = findIndex(fields, {
          id: data.id,
        });

        if (idx === -1) {
          append(data);
        } else {
          remove(idx);
        }
      };
    },
    [fields]
  );

  return (
    <Fragment>
      <Card
        title={messages["variantInfo"]}
        cardBodyComponent={() => {
          return (
            <Grid container>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="name"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["variantName"] as string}
                        placeholder={messages["variantName"] as string}
                        FormControlProps={{ required: true }}
                        InputProps={{
                          readOnly: !writePermission,
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <ImageThumbList
                  {...{
                    data: variantImageData,
                    toggle,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputNumber
                  FormLabelProps={{ children: messages["productPrice"] as string }}
                  InputProps={{
                    inputProps: { placeholder: messages["productPrice"] as string },
                  }}
                  readOnly={true}
                  NumberFormatProps={{
                    value: get(defaultValues, "priceForDisplay"),
                    suffix: " ₫",
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="price_incl_tax"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["productPriceInclTax"] as string}
                        placeholder={messages["productPriceInclTax"] as string}
                        readOnly={!writePermission}
                        NumberFormatProps={{
                          allowNegative: false,
                          suffix: " ₫",
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="unit"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["unit"] as string}
                        placeholder={messages["unit"] as string}
                        InputProps={{
                          readOnly: !writePermission,
                        }}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="weight"
                  control={control}
                  render={(props) => {
                    return (
                      <FormControlForNumber
                        controlState={props}
                        label={messages["weight"] as string}
                        placeholder={messages["weight"] as string}
                        NumberFormatProps={{
                          suffix: ` ${setting?.weight_unit}`,
                          allowNegative: false,
                        }}
                        readOnly={!writePermission}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="bar_code"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["barcode"] as string}
                        placeholder={messages["barcode"] as string}
                        InputProps={{ readOnly: !writePermission }}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="editable_sku"
                  render={(props) => {
                    return (
                      <FormControl
                        controlState={props}
                        label={messages["editableSku"] as string}
                        placeholder={messages["editableSku"] as string}
                        InputProps={{ readOnly: !writePermission }}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          );
        }}
      />
      <ImageDialog
        {...{
          open,
          toggle,
          selectedImageList: fields,
          loading,
          selectImageHandler,
          updateHandler: variantImageHandleSubmit((imageData) => {
            const { images } = imageData;

            if (variantImageData != undefined) {
              onSubmit({
                data: images,
                originalData: variantImageData,
              });
            }
          }),
        }}
      />
    </Fragment>
  );
};

export default GeneralInfo;
