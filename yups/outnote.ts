import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePriceIncludeTax, transformNumberNotEmpty } from "./utils";
import { getChoiceValue } from "../libs";
import { ChoiceType } from "interfaces";

import { WAREHOUSE_ITEM } from "interfaces";

export interface OutnoteSchemaProps {
  id?: number;
  status: string;
  shipping_excl_tax: string;
  shipping_incl_tax: string;
  amount: string;
  amount_incl_tax: string;
  warehouse: WAREHOUSE_ITEM | null;
  notes: string;
  sid?: string;
}

export const outnoteSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        status: mixed(),
        shipping_excl_tax: transformNumberNotEmpty(),
        shipping_incl_tax: validatePriceIncludeTax("shipping_excl_tax"),
        amount: transformNumberNotEmpty(),
        amount_incl_tax: validatePriceIncludeTax("amount"),
        notes: string(),
        warehouse: mixed().required(),
      })
    );
  }

  const { stock_out_note_statuses } = choice;

  return yupResolver(
    object().shape({
      status: string().oneOf(getChoiceValue(stock_out_note_statuses)),
      shipping_excl_tax: transformNumberNotEmpty(),
      shipping_incl_tax: validatePriceIncludeTax("shipping_excl_tax"),
      amount: transformNumberNotEmpty(),
      amount_incl_tax: validatePriceIncludeTax("amount"),
      notes: string(),
      warehouse: mixed().required(),
    })
  );
};

export const defaultOutnoteFormState = (choice?: ChoiceType): OutnoteSchemaProps => {
  if (choice == undefined) {
    return {
      status: "",
      shipping_incl_tax: "0",
      shipping_excl_tax: "0",
      amount: "0",
      amount_incl_tax: "0",
      notes: "",
      warehouse: null,
    };
  }

  const { stock_out_note_statuses } = choice;
  return {
    status: getChoiceValue(stock_out_note_statuses)[0],
    shipping_incl_tax: "0",
    shipping_excl_tax: "0",
    amount: "0",
    amount_incl_tax: "0",
    notes: "",
    warehouse: null,
  };
};
