import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ReturnOrderQuantitySchemaProps {
  id?: number;
  order: string;
  receipt_order_quantity: string;
  quantity: string;
}

export const returnOrderQuantitySchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        order: string(),
        receipt_order_quantity: string(),
        quantity: transformNumberNotEmpty(),
      })
    );
  }

  return yupResolver(
    object().shape({
      order: string(),
      receipt_order_quantity: string(),
      quantity: transformNumberNotEmpty(),
    })
  );
};

export const defaultReturnOrderQuantityFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      order: "",
      receipt_order_quantity: "",
      quantity: "0",
    };
  }

  return { order: "", receipt_order_quantity: "", quantity: "0" };
};
