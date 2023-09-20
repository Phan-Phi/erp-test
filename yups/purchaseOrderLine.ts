import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";

import { getChoiceValue } from "../libs";
import { ChoiceType } from "interfaces";

export interface PurchaseOrderLineSchemaProps {
  id?: number;
  quantity: string;
  offer_description: string;
  order: string;
  variant: object | null;
  discount_type: string;
  discount_amount: string;
}

export const purchaseOrderLineSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        quantity: string(),
        offer_description: string(),
        order: string(),
        variant: mixed(),
        discount_type: string(),
        discount_amount: transformNumberNotEmpty(),
      })
    );
  }

  const { discount_types } = choice;

  return yupResolver(
    object().shape({
      quantity: string(),
      offer_description: string(),
      order: string(),
      variant: mixed(),
      discount_type: string().oneOf(getChoiceValue(discount_types)),
      discount_amount: transformNumberNotEmpty(),
    })
  );
};

export const defaultPurchaseOrderLineFormState = (
  choice?: ChoiceType
): PurchaseOrderLineSchemaProps => {
  if (choice == undefined) {
    return {
      quantity: "1",
      offer_description: "",
      order: "",
      variant: null,
      discount_type: "",
      discount_amount: "0",
    };
  }

  const { discount_types } = choice;

  return {
    quantity: "1",
    offer_description: "",
    order: "",
    variant: null,
    discount_type: getChoiceValue(discount_types)[0],
    discount_amount: "0",
  };
};
