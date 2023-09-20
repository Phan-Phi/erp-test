import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty, validatePriceIncludeTax } from "./utils";
import { getChoiceValue } from "../libs";
import { ChoiceType, ORDER_SHIPPER_ITEM } from "interfaces";

export interface InvoiceSchemaProps {
  id?: number;
  order: string;
  status: string;
  shipping_status: string;
  cod: boolean;
  shipping_incl_tax: string;
  shipping_excl_tax: string;
  surcharge: string;
  shipper: ORDER_SHIPPER_ITEM | null;
}

export const invoiceSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        order: string(),
        status: string(),
        shipping_status: string(),
        cod: boolean(),
        shipping_incl_tax: validatePriceIncludeTax("shipping_excl_tax"),
        shipping_excl_tax: transformNumberNotEmpty(),
        surcharge: transformNumberNotEmpty(),
        shipper: mixed(),
      })
    );
  }

  const { invoice_statuses, shipping_statuses } = choice;

  return yupResolver(
    object().shape({
      order: string(),
      status: string().oneOf(getChoiceValue(invoice_statuses)),
      shipping_status: string().oneOf(getChoiceValue(shipping_statuses)),
      cod: boolean(),
      shipping_incl_tax: validatePriceIncludeTax("shipping_excl_tax"),
      shipping_excl_tax: transformNumberNotEmpty(),
      surcharge: transformNumberNotEmpty(),
      shipper: mixed(),
    })
  );
};

export const defaultInvoiceFormState = (choice?: ChoiceType): InvoiceSchemaProps => {
  if (choice == undefined) {
    return {
      order: "",
      status: "",
      shipping_status: "",
      cod: false,
      shipping_incl_tax: "0",
      shipping_excl_tax: "0",
      surcharge: "0",
      shipper: null,
    };
  }

  const { invoice_statuses, shipping_statuses } = choice;

  return {
    order: "",
    status: getChoiceValue(invoice_statuses)[0],
    shipping_status: getChoiceValue(shipping_statuses)[0],
    cod: false,
    shipping_incl_tax: "0",
    shipping_excl_tax: "0",
    surcharge: "0",
    shipper: null,
  };
};
