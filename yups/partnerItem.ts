import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty, validatePriceIncludeTax } from "./utils";
import { ChoiceType } from "interfaces";

export interface PartnerItemSchemaProps {
  id?: number;
  partner: string;
  variant: string;
  partner_sku: string;
  price: string;
  price_incl_tax: string;
}

export const partnerItemSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        partner_sku: string(),
        price: transformNumberNotEmpty().test({
          test: (value) => {
            return true;
          },
        }),
        price_incl_tax: validatePriceIncludeTax("price"),
        partner: string().required(),
        variant: string().required(),
      })
    );
  }

  return yupResolver(
    object().shape({
      partner_sku: string(),
      price: transformNumberNotEmpty().test({
        test: (value) => {
          return true;
        },
      }),
      price_incl_tax: validatePriceIncludeTax("price"),
      partner: string().required(),
      variant: string().required(),
    })
  );
};

export const defaultPartnerItemFormState = (
  choice?: ChoiceType
): PartnerItemSchemaProps => {
  if (choice == undefined) {
    return {
      partner_sku: "",
      price: "0",
      price_incl_tax: "0",
      partner: "",
      variant: "",
    };
  }

  return {
    partner_sku: "",
    price: "0",
    price_incl_tax: "0",
    partner: "",
    variant: "",
  };
};
