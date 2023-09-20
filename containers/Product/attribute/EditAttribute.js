import useSWR from "swr";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { useCallback, useState, useEffect, Fragment } from "react";

import pick from "lodash/pick";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import differenceWith from "lodash/differenceWith";

import { Grid, Stack } from "@mui/material";

import { PRODUCTS, ATTRIBUTE } from "routes";

import DynamicMessage from "messages";

import { useChoice, usePermission } from "hooks";

import {
  FailToLoad,
  Card,
  LoadingDynamic as Loading,
  LoadingButton,
  BackButton,
} from "components";

import ProductAttributeForm from "./components/ProductAttributeForm";
import ProductAttributeOptionFormForUpdate from "./components/ProductAttributeOptionFormForUpdate";

import {
  productAttributeSchema,
  defaultProductAttributeFormState,
  productAttributeOptionSchema,
} from "yups";

import { PRODUCT_ATTRIBUTE, PRODUCT_ATTRIBUTE_OPTION } from "apis";

import {
  checkResArr,
  transformUrl,
  createRequest,
  updateRequest,
  deleteRequest,
} from "libs";

import axios from "axios.config";

const EditAttribute = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState();

  const [defaultOptionList, setDefaultOptionList] = useState();

  const {
    data: productAttributeData,
    error: productAttributeError,
    mutate: productAttributeMutate,
  } = useSWR(() => {
    const id = router.query.id;
    if (id) {
      const params = {
        use_cache: false,
      };

      return transformUrl(`${PRODUCT_ATTRIBUTE}${id}`, params);
    }
  });

  const { data: optionList, mutate: mutateOptionList } = useSWR(() => {
    const attributeId = router.query.id;

    if (attributeId) {
      const params = {
        get_all: true,
        attribute: attributeId,
        nested_depth: 1,
        use_cache: false,
      };

      return transformUrl(PRODUCT_ATTRIBUTE_OPTION, params);
    }
  });

  useEffect(() => {
    if (productAttributeData == undefined) {
      return;
    }

    let data = pick(productAttributeData, [
      ...Object.keys(defaultProductAttributeFormState()),
      "id",
    ]);

    setDefaultValues(data);
  }, [productAttributeData]);

  useEffect(() => {
    if (optionList == undefined) {
      return;
    }

    setDefaultOptionList(optionList);
  }, [optionList]);

  const onSuccessHandler = useCallback(async () => {
    await productAttributeMutate();
    await mutateOptionList();
    router.replace(`/${PRODUCTS}/${ATTRIBUTE}`);
  }, []);

  if (productAttributeError) {
    return <FailToLoad />;
  }

  if (defaultValues == undefined || defaultOptionList == undefined) {
    return <Loading />;
  }

  return (
    <AttributeForm
      {...{
        defaultValues,
        defaultOptionList,
        onSuccessHandler,
      }}
    />
  );
};

const AttributeForm = ({ defaultValues, defaultOptionList, onSuccessHandler }) => {
  const choice = useChoice();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: productAttributeSchema({ choice }),
  });

  const {
    control: productAttributeOptionControl,
    handleSubmit: productAttributeOptionHandleSubmit,
    clearErrors: productAttributeOptionClearErrors,
    setValue,
  } = useForm({
    defaultValues: {
      options: defaultOptionList,
    },
    resolver: productAttributeOptionSchema(),
  });

  const { formatMessage, messages } = useIntl();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission: writePermission } = usePermission("write_attribute");

  const onSubmit = useCallback(
    async ({ data, dirtyFields, optionData, originalOptionData }) => {
      const { id: attributeId } = data;

      setLoading(true);

      const newOptionData = [];
      const optionDataWithId = [];

      optionData.forEach((el) => {
        if (el.id) {
          const data = pick(el, ["id", "name", "value"]);

          optionDataWithId.push(data);
        } else {
          newOptionData.push({ ...el, attribute: attributeId });
        }
      });

      const updateOptionData = differenceWith(
        optionDataWithId,
        originalOptionData,
        (el1, el2) => {
          const keys = ["name", "value"];

          const obj1 = pick(el1, keys);
          const obj2 = pick(el2, keys);

          if (isEqual(obj1, obj2)) {
            return true;
          } else {
            return false;
          }
        }
      );

      const deleteOptionData = differenceWith(
        originalOptionData,
        optionDataWithId,
        (el1, el2) => {
          const keys = ["id"];

          const obj1 = pick(el1, keys);
          const obj2 = pick(el2, keys);

          if (isEqual(obj1, obj2)) {
            return true;
          } else {
            return false;
          }
        }
      );

      try {
        let resList = [];

        if (!isEmpty(dirtyFields)) {
          const body = pick(data, Object.keys(dirtyFields));

          await axios.patch(`${PRODUCT_ATTRIBUTE}${attributeId}/`, body);
        }

        if (!isEmpty(deleteOptionData)) {
          const deleteIdList = deleteOptionData.map((el) => {
            return el.id;
          });

          const results = await deleteRequest(PRODUCT_ATTRIBUTE_OPTION, deleteIdList);

          resList = [...resList, ...results];
        }

        if (!isEmpty(newOptionData)) {
          const results = await createRequest(PRODUCT_ATTRIBUTE_OPTION, newOptionData);

          resList = [...resList, ...results];
        }

        if (!isEmpty(updateOptionData)) {
          const results = await updateRequest(PRODUCT_ATTRIBUTE_OPTION, updateOptionData);

          resList = [...resList, ...results];
        }

        const result = checkResArr(resList, enqueueSnackbar);

        if (result) {
          enqueueSnackbar(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "thuộc tính",
            }),
            {
              variant: "success",
            }
          );

          await onSuccessHandler();
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Card
          title={messages["updateProductAttribute"]}
          body={
            <Fragment>
              <ProductAttributeForm control={control} />
              <ProductAttributeOptionFormForUpdate
                control={productAttributeOptionControl}
                setValue={setValue}
                clearErrors={productAttributeOptionClearErrors}
              />
            </Fragment>
          }
        />
      </Grid>
      <Grid item xs={8}>
        <Stack direction="row" justifyContent="space-between">
          <BackButton
            {...{
              pathname: `/${PRODUCTS}/${ATTRIBUTE}`,
            }}
          />
          {writePermission && (
            <LoadingButton
              {...{
                loading,
                type: "update",
                onClick: handleSubmit((data) => {
                  productAttributeOptionHandleSubmit((attributeOptionData) => {
                    const { options: optionData } = attributeOptionData;

                    onSubmit({
                      data,
                      optionData,
                      originalOptionData: defaultOptionList,
                      dirtyFields,
                    });
                  })();
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

export default EditAttribute;
