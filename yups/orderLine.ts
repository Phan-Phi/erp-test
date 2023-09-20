import { string, object, mixed, boolean, NumberSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";
import { transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export interface OrderLineSchemaProps {
  id?: number;
  discount_type: string;
  discount_amount: string;
  order: string;
  unit: string;
  unit_quantity: string;
  variant: object | null;
}

export const orderLineSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        discount_type: string(),
        discount_amount: transformNumberNotEmpty(),
        order: string(),
        unit: string().nullable(),
        unit_quantity: string(),
        variant: mixed(),
      })
    );
  }

  const { discount_types } = choice;

  return yupResolver(
    object().shape({
      discount_type: string().oneOf(getChoiceValue(discount_types)),
      discount_amount: transformNumberNotEmpty(),
      order: string(),
      unit: string().nullable(),
      unit_quantity: string(),
      variant: mixed(),
    })
  );
};

export const defaulOrderLinetFormState = (choice?: ChoiceType): OrderLineSchemaProps => {
  if (choice == undefined) {
    return {
      discount_type: "",
      discount_amount: "0",
      order: "",
      unit: "",
      unit_quantity: "1",
      variant: null,
    };
  }

  const { discount_types } = choice;

  return {
    discount_type: getChoiceValue(discount_types)[0],
    discount_amount: "0",
    order: "",
    unit: "",
    unit_quantity: "1",
    variant: null,
  };
};
