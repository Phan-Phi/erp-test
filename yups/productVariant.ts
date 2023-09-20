import { string, object, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";

import { ChoiceType } from "interfaces";

export interface ProductVariantSchemaProps {
  id?: number;
  is_default: boolean;
  editable_sku: string;
  unit: string;
  weight: string;
  bar_code: string;
  name: string;
  track_inventory: boolean;
  price_incl_tax: string;
  list_id_values: string;
}

export const productVariantSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        track_inventory: boolean(),
        is_default: boolean(),
        editable_sku: string().min(1),
        unit: string().required(),
        weight: string(),
        bar_code: string(),
        name: string().required(),
        price_incl_tax: transformNumberNotEmpty(),
        list_id_values: string(),
      })
    );
  }

  return yupResolver(
    object().shape({
      track_inventory: boolean(),
      is_default: boolean(),
      editable_sku: string(),
      unit: string().required(),
      weight: string(),
      bar_code: string(),
      name: string().required(),
      price_incl_tax: transformNumberNotEmpty(),
      list_id_values: string(),
    })
  );
};

export const defaultProductVariantFormState = (
  choice?: ChoiceType
): ProductVariantSchemaProps => {
  if (choice === undefined) {
    return {
      track_inventory: false,
      is_default: false,
      editable_sku: "",
      unit: "",
      weight: "0",
      bar_code: "",
      name: "",
      price_incl_tax: "0",
      list_id_values: "-",
    };
  }

  return {
    track_inventory: false,
    is_default: false,
    editable_sku: "",
    unit: "",
    weight: "0",
    bar_code: "",
    name: "",
    price_incl_tax: "0",
    list_id_values: "-",
  };
};
