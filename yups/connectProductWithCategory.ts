import { object, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

interface ExtendProductCategoryItem extends ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 {
  connectId?: number;
}

export interface ConnectProductWithCategorySchemaProps {
  categories: ExtendProductCategoryItem[];
}

export const connectProductWithCategorySchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        categories: array(object()),
      })
    );
  }

  return yupResolver(
    object().shape({
      categories: array(object()),
    })
  );
};

export const defaultConnectProductWithCategoryFormState = (
  choice?: ChoiceType
): ConnectProductWithCategorySchemaProps => {
  if (choice === undefined) {
    return {
      categories: [],
    };
  }

  return {
    categories: [],
  };
};
