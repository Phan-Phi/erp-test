import { object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePriceIncludeTax, transformNumberNotEmpty } from "./utils";
import { ChoiceType } from "interfaces";

export const warehouseRecordSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        low_stock_threshold: transformNumberNotEmpty().nullable(),
        price: transformNumberNotEmpty(),
        price_incl_tax: validatePriceIncludeTax("price"),
      })
    );
  }

  return yupResolver(
    object().shape({
      low_stock_threshold: transformNumberNotEmpty().nullable(),
      price: transformNumberNotEmpty(),
      price_incl_tax: validatePriceIncludeTax("price"),
    })
  );
};

export const defaultWarehouseRecordFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      price: "0",
      price_incl_tax: "0",
      low_stock_threshold: "0",
    };
  }

  return {
    price: "0",
    price_incl_tax: "0",
    low_stock_threshold: "0",
  };
};
