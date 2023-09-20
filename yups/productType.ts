import { string, object, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ProductTypeSchemaProps {
  id?: number;
  name: string;
  tax_rate: string;
  has_variants: boolean;
}

export const productTypeSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        name: string().required().trim(),
        tax_rate: transformNumberNotEmpty(),
        has_variants: boolean(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required().trim(),
      tax_rate: transformNumberNotEmpty(),
      has_variants: boolean(),
    })
  );
};

export const defaultProductTypeFormState = (
  choice?: ChoiceType
): ProductTypeSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      has_variants: false,
      tax_rate: "0",
    };
  }

  return {
    name: "",
    has_variants: false,
    tax_rate: "0",
  };
};
