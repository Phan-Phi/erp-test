import { string, object, mixed, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";
import { transformNumberNotEmpty, validateDateEnd } from "./utils";
import { ChoiceType } from "interfaces";

export interface DiscountSchemaProps {
  id?: number;
  discount_type: string;
  name: string;
  discount_amount: string;
  date_start: Date | null;
  date_end: Date | null;
}

export const discountSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        name: string().required(),
        discount_type: mixed().required(),
        discount_amount: string().nullable(),
        usage_limit: transformNumberNotEmpty(),
      })
    );
  }

  const { discount_types } = choice;

  return yupResolver(
    object().shape({
      name: string().required(),
      discount_type: mixed().required().oneOf(getChoiceValue(discount_types)),
      discount_amount: string().nullable(),
      date_start: date().nullable(),
      date_end: validateDateEnd("date_start"),
    })
  );
};

export const defaultDiscountFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      discount_type: "",
      name: "",
      discount_amount: "0",
      date_start: new Date(),
      date_end: null,
    };
  }

  const { discount_types } = choice;

  return {
    discount_type: getChoiceValue(discount_types)[0],
    name: "",
    discount_amount: "0",
    date_start: new Date(),
    date_end: null,
  };
};
