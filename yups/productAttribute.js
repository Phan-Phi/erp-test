import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";
export default (data) => {
  if (data === undefined) {
    return yupResolver(
      object().shape({
        input_type: mixed().required().oneOf(productAttributeTypes),
        name: string().required().trim().max(255),
        is_variant_only: boolean(),
      })
    );
  }

  const { choice, type } = data;

  const { product_attribute_types } = choice;

  return yupResolver(
    object().shape({
      input_type: mixed().required().oneOf(getChoiceValue(product_attribute_types)),
      name: string().required().trim(),
      is_variant_only: boolean(),
    })
  );
};

export const defaultFormState = (data) => {
  if (data === undefined) {
    return {
      input_type: "",
      name: "",
      is_variant_only: false,
    };
  }

  const { choice, type } = data;

  const { product_attribute_types } = choice;

  return {
    input_type: getChoiceValue(product_attribute_types)[0],
    name: "",
    is_variant_only: false,
  };
};
