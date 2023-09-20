import { string, object, mixed, boolean, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ReceiptOrderQuantitySchemaProps {
  id?: number;
  order: string;
  line: string;
  quantity: string;
  notes: string;
  expiration_date: Date | null;
}

export const receiptOrderQuantitySchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        order: string(),
        line: string(),
        quantity: transformNumberNotEmpty(),
        notes: string(),
        expiration_date: date().nullable(),
      })
    );
  }

  return yupResolver(
    object().shape({
      order: string(),
      line: string(),
      quantity: transformNumberNotEmpty(),
      notes: string(),
      expiration_date: date().nullable(),
    })
  );
};

export const defaultReceiptOrderQuantityFormState = (
  choice?: ChoiceType
): ReceiptOrderQuantitySchemaProps => {
  if (choice === undefined) {
    return { order: "", line: "", quantity: "0", notes: "", expiration_date: new Date() };
  }

  return { order: "", line: "", quantity: "0", notes: "", expiration_date: new Date() };
};
