import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";

import { validatePriceIncludeTax, validateWeight } from "./utils";
import { ChoiceType } from "interfaces";

export interface ShippingMethodSchemaProps {
  id?: number;
  type: string;
  name: string;
  price: string;
  price_incl_tax: string;
  minimum_order_price: string;
  maximum_order_price: string;
  minimum_order_weight: string;
  maximum_order_weight: string;
}

export const shippingMethodSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        name: string().required(),
        type: mixed().required(),
        price: string().nullable(),
        price_incl_tax: validatePriceIncludeTax("price"),
        minimum_order_price: string().nullable(),
        maximum_order_price: string().nullable(),
        minimum_order_weight: string().nullable(),
        maximum_order_weight: string().nullable(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required(),
      type: mixed().required().oneOf(getChoiceValue(choice["shipping_method_types"])),
      price: string().nullable(),
      price_incl_tax: validatePriceIncludeTax("price"),
      minimum_order_price: string().nullable(),
      maximum_order_price: validatePriceIncludeTax("minimum_order_price"),
      minimum_order_weight: string().nullable(),
      maximum_order_weight: validateWeight("minimum_order_weight"),
    })
  );
};

export const defaultShippingMethodFormState = (
  choice?: ChoiceType
): ShippingMethodSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      type: "",
      price: "0",
      price_incl_tax: "0",
      minimum_order_price: "0",
      maximum_order_price: "0",
      minimum_order_weight: "0",
      maximum_order_weight: "0",
    };
  }

  return {
    name: "",
    type: getChoiceValue(choice["shipping_method_types"])[0],
    price: "0",
    price_incl_tax: "0",
    minimum_order_price: "0",
    maximum_order_price: "0",
    minimum_order_weight: "0",
    maximum_order_weight: "0",
  };
};
