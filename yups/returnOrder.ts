import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface ReturnOrderSchemaProps {
  id?: number;
  status: string;
  surcharge: string;
  notes: string;
  order: string;
}

export const returnOrderSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        status: string(),
        surcharge: transformNumberNotEmpty(),
        notes: string(),
        order: string(),
      })
    );
  }

  const { return_order_statuses } = choice;

  return yupResolver(
    object().shape({
      status: string().oneOf(getChoiceValue(return_order_statuses)),
      surcharge: transformNumberNotEmpty(),
      notes: string(),
      order: string(),
    })
  );
};

export const defaultReturnOrderFormState = (
  choice?: ChoiceType
): ReturnOrderSchemaProps => {
  if (choice === undefined) {
    return {
      status: "",
      surcharge: "0",
      notes: "",
      order: "",
    };
  }

  const { return_order_statuses } = choice;

  return {
    status: getChoiceValue(return_order_statuses)[0],
    surcharge: "0",
    notes: "",
    order: "",
  };
};
