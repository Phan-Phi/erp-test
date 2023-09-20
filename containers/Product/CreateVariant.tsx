import useSWR from "swr";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useState, useEffect } from "react";

import { get, set } from "lodash";
import { Grid, Stack } from "@mui/material";

import {
  Card,
  Switch,
  Checkbox,
  BackButton,
  CheckboxItem,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import { FormControl, FormControlForNumber } from "compositions";

import axios from "axios.config";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { PRODUCTS, VARIANT } from "routes";
import { useNotification, useSetting } from "hooks";

import {
  ADMIN_PRODUCTS_VARIANTS_POST_YUP_RESOLVER,
  ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_PRODUCTS_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
  ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1,
  ADMIN_PRODUCT_ATTRIBUTE_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_PRODUCTS_VARIANTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateVariant = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<any>();

  const { data: productData } = useSWR<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(() => {
    const id = router.query.id;

    if (id == undefined) return;

    return `${ADMIN_PRODUCTS_END_POINT}${id}`;
  });

  const { data: variantAttributeData } = useSWR<
    ADMIN_PRODUCT_ATTRIBUTE_VARIANT_VIEW_TYPE_V1[]
  >(() => {
    let productClassId = get(productData, "product_class.id");

    if (productClassId) {
      const params = {
        get_all: true,
        product_class: productClassId,
      };

      return transformUrl(ADMIN_PRODUCTS_TYPES_VARIANT_ATTRIBUTES_END_POINT, params);
    }
  });

  useEffect(() => {
    if (productData == undefined) return;

    const productId = get(productData, "id");
    const name = get(productData, "name");

    const data = {
      ...ADMIN_PRODUCTS_VARIANTS_POST_DEFAULT_VALUE,
      name,
      product: productId,
    };

    setDefaultValues(data);
  }, [productData]);

  if (defaultValues == undefined || variantAttributeData == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent {...{ defaultValues, defaultAttributeValues: variantAttributeData }} />
  );
};

interface RootComponentProps {
  defaultValues: ADMIN_PRODUCTS_VARIANTS_POST_YUP_SCHEMA_TYPE;
  defaultAttributeValues: ADMIN_PRODUCT_ATTRIBUTE_VARIANT_VIEW_TYPE_V1[];
}

const RootComponent = ({ defaultValues, defaultAttributeValues }: RootComponentProps) => {
  const { formatMessage, messages } = useIntl();
  const router = useRouter();
  const { handleSubmit, control } = useForm({
    defaultValues,
    resolver: ADMIN_PRODUCTS_VARIANTS_POST_YUP_RESOLVER,
  });

  const setting = useSetting();
  const [selectedAttribute, setSelectedAttribute] = useState([]);

  const isMounted = useMountedState();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const onSubmit = useCallback(async ({ data }) => {
    try {
      setLoading(true);

      const { data: resData } = await axios.post(ADMIN_PRODUCTS_VARIANTS_END_POINT, data);

      const variantId = get(resData, "id");

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "biến thể",
        })
      );

      const pathname = `/${PRODUCTS}/${router.query.id}/${VARIANT}/${variantId}`;
      router.replace(pathname, pathname, { shallow: true });
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title={messages["createVariant"]}
          body={
            <Grid container>
              {/* <Grid item xs={12}>
                <Grid container>
                  {defaultAttributeValues.map((el, idx) => {
                    return (
                      <Grid item xs={6} key={el.id}>
                        <SelectWrapper
                          data={el}
                          onChange={(data) => {
                            setSelectedAttribute((prev) => {
                              prev[idx] = data;

                              return prev;
                            });
                          }}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid> */}

              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6}>
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
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name="unit"
                      render={(props) => {
                        return (
                          <FormControl
                            controlState={props}
                            label={messages["unit"] as string}
                            placeholder={messages["unit"] as string}
                            FormControlProps={{ required: true }}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name="weight"
                      render={(props) => {
                        return (
                          <FormControlForNumber
                            controlState={props}
                            label={messages["weight"] as string}
                            placeholder={messages["weight"] as string}
                            NumberFormatProps={{
                              allowNegative: false,
                              suffix: ` ${setting?.weight_unit}`,
                            }}
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
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      control={control}
                      name="price_incl_tax"
                      render={(props) => {
                        return (
                          <FormControlForNumber
                            controlState={props}
                            label={messages["price"] as string}
                            placeholder={messages["price"] as string}
                            NumberFormatProps={{
                              allowNegative: false,
                            }}
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
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Checkbox
                      {...{
                        control,
                        name: "is_default",
                        label:
                          (messages["defaultVariant"] as string) || "Biến thể mặc định",

                        renderItem({ value, onChange }) {
                          return (
                            <CheckboxItem
                              label=""
                              CheckboxProps={{
                                value,
                                onChange,
                              }}
                            />
                          );
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Switch
                      {...{
                        control,
                        name: "track_inventory",
                        label:
                          (messages["trackInventory"] as string) || "Theo dõi tồn kho",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          }
        />
      </Grid>
      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${PRODUCTS}/${router.query.id}`} />

          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              const listIdValues = selectedAttribute.join("-");
              set(data, "list_id_values", listIdValues);
              onSubmit({ data });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateVariant;

// const SelectWrapper = ({ data, onChange }) => {
//   const [attributeOptionData, setAttributeOptionData] = useState();

//   const {
//     attribute: { id: attributeId, name: attributeName },
//   } = data;

//   const { data: productAttributeOptionData } = useSWR(() => {
//     return transformUrl(PRODUCT_ATTRIBUTE_OPTION, {
//       get_all: true,
//       use_cache: false,
//       attribute: attributeId,
//     });
//   });

//   useEffect(() => {
//     if (productAttributeOptionData == undefined) {
//       return;
//     }

//     let data = [{ id: "", name: "None" }];

//     data = [...data, ...productAttributeOptionData];

//     setAttributeOptionData(data);
//   }, [productAttributeOptionData]);

//   if (productAttributeOptionData == undefined || attributeOptionData == undefined) {
//     return <Loading />;
//   }

//   return (
//     <Select
//       {...{
//         InputLabelProps: {
//           children: attributeName,
//         },
//         SelectProps: {
//           onChange: (e) => {
//             onChange(e.target.value);
//           },
//         },

//         items: () => {
//           return attributeOptionData.map((el) => {
//             return (
//               <MenuItem key={el.id} value={el.id}>
//                 {el.name}
//               </MenuItem>
//             );
//           });
//         },
//       }}
//     />
//   );
// };
