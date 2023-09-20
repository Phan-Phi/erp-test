import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface SaleInChargeSchemaProps {
  id?: number;
  sales_in_charge: object | null;
  max_debt: string;
}

export const saleInChargeSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        sales_in_charge: mixed(),
        max_debt: string().trim(),
      })
    );
  }

  return yupResolver(
    object().shape({
      sales_in_charge: mixed(),
      max_debt: string().trim(),
    })
  );
};

export const defaultSaleInChargeFormState = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return {
      sales_in_charge: null,
      max_debt: "",
    };
  }

  return {
    sales_in_charge: null,
    max_debt: "",
  };
};
