import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ReceiptOrderSchemaProps {
  id?: number;
  status: string;
  surcharge: string;
  notes: string;
  order: string;
}

export const receiptOrderSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        status: string(),
        surcharge: transformNumberNotEmpty(),
        notes: string(),
        order: string(),
      })
    );
  }

  const { receipt_order_statuses } = choice;

  return yupResolver(
    object().shape({
      status: string().oneOf(getChoiceValue(receipt_order_statuses)),
      surcharge: transformNumberNotEmpty(),
      notes: string(),
      order: string(),
    })
  );
};

export const defaultReceiptOrderFormState = (
  choice?: ChoiceType
): ReceiptOrderSchemaProps => {
  if (choice == undefined) {
    return {
      status: "",
      surcharge: "0",
      notes: "",
      order: "",
    };
  }

  const { receipt_order_statuses } = choice;

  return {
    status: getChoiceValue(receipt_order_statuses)[0],
    surcharge: "0",
    notes: "",
    order: "",
  };
};
