import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { Controller, Control } from "react-hook-form";

import useSWR from "swr";
import { get, set, unset, groupBy, isEmpty } from "lodash";
import { Grid, MenuItem, Autocomplete } from "@mui/material";

import { FormControl, InputForAutocomplete } from "compositions";

import { transformUrl } from "libs";
import { usePermission } from "hooks";

import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type CategoryFormProps = {
  control: any;
};

const CategoryForm = ({ control }: CategoryFormProps) => {
  const _control = control as Control<ADMIN_CUSTOMERS_TYPES_POST_YUP_SCHEMA_TYPE>;

  const router = useRouter();
  const { messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_purchase_channel");

  const { data: productCategoryData } = useSWR<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1[]>(
    () => {
      const id = router.query.id;

      let params: object = {};

      if (id) {
        params = {
          get_all: true,
          nested_depth: 1,
          not_have_products: true,
          use_cache: false,
          is_not_descendant_of: id,
        };
      } else {
        params = {
          get_all: true,
          nested_depth: 1,
          not_have_products: true,
        };
      }

      return transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, params);
    }
  );

  const transformedData = useMemo(() => {
    if (productCategoryData == undefined || isEmpty(productCategoryData)) {
      return;
    }

    let groupedData = groupBy(productCategoryData, "parent");

    const roots = get(groupedData, "null");

    unset(groupedData, "null");

    let orderedData: ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1[] = [];

    let traverseTree = (id: any, level: any) => {
      if (groupedData[id]) {
        for (let el of groupedData[id]) {
          set(el, "level", level);
          orderedData.push(el);
          traverseTree(el.id, level + 1);
        }
      } else {
        return;
      }
    };

    for (let root of roots) {
      set(root, "level", 0);
      orderedData.push(root);
      traverseTree(root.id, 1);
    }

    return orderedData;
  }, [productCategoryData]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          name="name"
          control={_control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["categoryName"] as string}
                placeholder={messages["categoryName"] as string}
                InputProps={{
                  readOnly: !writePermission,
                }}
                FormControlProps={{
                  required: true,
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        {transformedData && (
          <Fragment>
            <Controller
              name="parent"
              control={_control}
              render={(props) => {
                const { field, fieldState } = props;
                const { value, onChange } = field;
                const { error } = fieldState;

                return (
                  <Autocomplete
                    disabled={!writePermission}
                    options={transformedData}
                    getOptionLabel={(option) => option.name}
                    value={value as any}
                    onChange={(_, value) => onChange(value)}
                    renderOption={(props, option) => {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={option.name}
                          sx={{
                            marginLeft: option.level * 1.5,
                            fontWeight: (theme) => {
                              if (option.level === 0) {
                                return theme.typography.fontWeightBold;
                              } else if (option.level === 1) {
                                return theme.typography.fontWeightMedium;
                              } else {
                                return theme.typography.fontWeightRegular;
                              }
                            },
                            fontSize: (theme) => {
                              if (option.level === 0) {
                                return "15px";
                              } else if (option.level === 1) {
                                return "14px";
                              } else {
                                return "13px";
                              }
                            },
                          }}
                        />
                      );
                    }}
                    renderInput={(props) => {
                      return (
                        <InputForAutocomplete
                          {...props}
                          label={messages["parentCategory"] as string}
                          placeholder={messages["parentCategory"] as string}
                          error={!!error}
                          errorMessage={error && error.message}
                        />
                      );
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    }}
                  />
                );
              }}
            />
          </Fragment>
        )}
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="description"
          control={_control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["categoryDescription"] as string}
                placeholder={messages["categoryDescription"] as string}
                FormControlProps={{
                  disabled: !writePermission,
                }}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  readOnly: !writePermission,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default CategoryForm;
