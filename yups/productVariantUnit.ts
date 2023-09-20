import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ProductVariantUnitSchemaProps {
  id?: number;
  unit: string;
  multiply: string;
  weight: string;
  bar_code: string;
  price_incl_tax: string;
  editable_sku: string;
  variant?: string;
}

export const productVariantUnitSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        unit: string().required(),
        multiply: string().min(1),
        weight: string(),
        bar_code: string(),
        price_incl_tax: transformNumberNotEmpty(),
        editable_sku: string().min(1),
      })
    );
  }

  return yupResolver(
    object().shape({
      unit: string().required(),
      multiply: string().min(1),
      weight: string(),
      bar_code: string(),
      price_incl_tax: transformNumberNotEmpty(),
      editable_sku: string().min(1),
    })
  );
};

export const defaultProductVariantUnitFormState = (
  choice?: ChoiceType
): ProductVariantUnitSchemaProps => {
  if (choice === undefined) {
    return {
      unit: "",
      multiply: "1",
      weight: "0",
      bar_code: "",
      price_incl_tax: "0",
      editable_sku: "",
    };
  }

  return {
    unit: "",
    multiply: "1",
    weight: "0",
    bar_code: "",
    price_incl_tax: "0",
    editable_sku: "",
  };
};
