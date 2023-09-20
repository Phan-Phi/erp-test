import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useCallback, useState, Fragment } from "react";

import { Grid, Stack } from "@mui/material";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { PRODUCTS, ATTRIBUTE } from "routes";
import { usePermission, useChoice } from "hooks";
import { createRequest, checkResArr } from "libs";

import { LoadingDynamic as Loading, Card, BackButton, LoadingButton } from "components";

import DynamicMessage from "messages";

import { PRODUCT_ATTRIBUTE, PRODUCT_ATTRIBUTE_OPTION } from "apis";
import {
  productAttributeSchema,
  defaultProductAttributeFormState,
  productAttributeOptionSchema,
} from "yups";

import ProductAttributeForm from "./components/ProductAttributeForm";
import ProductAttributeOptionForm from "./components/ProductAttributeOptionForm";

import axios from "axios.config";

const CreateAttribute = () => {
  const choice = useChoice();

  const [defaultValues] = useState(defaultProductAttributeFormState({ choice }));

  if (defaultValues == undefined) {
    return <Loading />;
  }

  return <RootComponent defaultValues={defaultValues} />;
};

const RootComponent = ({ defaultValues }) => {
  const choice = useChoice();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: productAttributeSchema({ choice }),
  });

  const [loading, setLoading] = useState(false);
  const { formatMessage, messages } = useIntl();

  const {
    control: productAttributeOptionControl,
    handleSubmit: productAttributeOptionHandleSubmit,
    clearErrors: productAttributeOptionClearErrors,
  } = useForm({
    resolver: productAttributeOptionSchema(),
  });

  const onSubmit = useCallback(async ({ data, optionData }) => {
    try {
      setLoading(true);

      const { data: resData } = await axios.post(PRODUCT_ATTRIBUTE, data);

      let attributeId = get(resData, "id");

      if (!isEmpty(optionData) && attributeId) {
        const transformedOptionList = optionData.map((el) => {
          return {
            ...el,
            attribute: attributeId,
          };
        });
        const results = await createRequest(
          PRODUCT_ATTRIBUTE_OPTION,
          transformedOptionList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbar(
            formatMessage(DynamicMessage.createSuccessfully, {
              content: "thuộc tính",
            }),
            {
              variant: "success",
            }
          );
          router.push(`/${PRODUCTS}/${ATTRIBUTE}`);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Card
          title={messages["createProductAttribute"]}
          body={
            <Fragment>
              <ProductAttributeForm control={control} />
              <ProductAttributeOptionForm
                control={productAttributeOptionControl}
                clearErrors={productAttributeOptionClearErrors}
              />
            </Fragment>
          }
        />
      </Grid>

      <Grid item xs={8}>
        <Stack direction="row" justifyContent="space-between">
          <BackButton pathname={`/${PRODUCTS}/${ATTRIBUTE}`} />
          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              productAttributeOptionHandleSubmit((attributeOptionData) => {
                const { options: optionData } = attributeOptionData;

                onSubmit({ data, optionData });
              })();
            })}
            type="create"
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateAttribute;
