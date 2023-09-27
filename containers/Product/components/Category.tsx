import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useFieldArray, Control } from "react-hook-form";

import useSWR from "swr";
import { isEmpty } from "lodash";
import { Stack, Button, MenuItem, Autocomplete } from "@mui/material";

import { InputForAutocomplete } from "compositions";
import { Card, NoData, LoadingDynamic as Loading } from "components";

import { transformUrl } from "libs";
import { usePermission } from "hooks";
import { PRODUCTS, CATEGORY, CREATE } from "routes";
import { ConnectProductWithCategorySchemaProps } from "yups";

import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CategoryProps = {
  control: Control<ConnectProductWithCategorySchemaProps>;
};

const Category = ({ control }: CategoryProps) => {
  const router = useRouter();
  const { messages } = useIntl();

  const { fields, replace } = useFieldArray({
    control,
    name: "categories",
    keyName: "formId",
  });

  const { data: productCategoryData } = useSWR<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1[]>(
    () => {
      const params = {
        get_all: true,
        use_cache: false,
        is_leaf: true,
      };
      return transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, params);
    }
  );

  const { hasPermission: writePermission } = usePermission("write_product");

  if (productCategoryData == undefined) {
    return <Loading />;
  }

  return (
    <Card
      title={messages["productCategory"] as string}
      cardBodyComponent={() => {
        if (productCategoryData.length === 0) {
          return (
            <Stack spacing={2} justifyContent="center" alignItems="center">
              <NoData>{messages["noProductCategory"] as string}</NoData>
              <Button
                variant="contained"
                onClick={() => {
                  let pathname = `/${PRODUCTS}/${CATEGORY}/${CREATE}`;

                  router.push(pathname, pathname, { shallow: true });
                }}
              >
                {messages["createProductCategory"]}
              </Button>
            </Stack>
          );
        } else {
          return (
            <Fragment>
              <Autocomplete
                disabled={!writePermission}
                multiple={true}
                options={productCategoryData}
                value={fields}
                onChange={(_, data) => {
                  replace(data);
                }}
                renderInput={(props) => {
                  return (
                    <InputForAutocomplete
                      {...props}
                      label={messages["productCategory"] as string}
                      placeholder={messages["productCategory"] as string}
                    />
                  );
                }}
                getOptionLabel={(option) => {
                  return option.name;
                }}
                renderOption={(props, option) => {
                  return (
                    <MenuItem {...props} key={props.id}>
                      {option.full_name}
                    </MenuItem>
                  );
                }}
                isOptionEqualToValue={(option, value) => {
                  if (isEmpty(option) || isEmpty(value)) {
                    return true;
                  }

                  return option?.["id"] === value?.["id"];
                }}
              />
            </Fragment>
          );
        }
      }}
    />
  );
};

export default Category;
