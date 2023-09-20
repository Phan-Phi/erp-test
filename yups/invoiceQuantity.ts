import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { transformNumberNotEmpty } from "./utils";
import { ChoiceType, WAREHOUSE_ITEM } from "interfaces";

export interface InvoiceQuantitySchemaProps {
  id?: number;
  invoice: string;
  line: string;
  unit_quantity: string;
  record: string;
  warehouse: WAREHOUSE_ITEM | null;
}

export const invoiceQuantitySchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        invoice: string(),
        line: string(),
        unit_quantity: transformNumberNotEmpty(),
        record: string(),
        warehouse: object(),
      })
    );
  }

  return yupResolver(
    object().shape({
      invoice: string(),
      line: string(),
      unit_quantity: transformNumberNotEmpty(),
      record: string(),
      warehouse: object(),
    })
  );
};

export const defaultInvoiceQuantityFormState = (
  choice?: ChoiceType
): InvoiceQuantitySchemaProps => {
  if (choice == undefined) {
    return {
      invoice: "",
      line: "",
      unit_quantity: "0",
      record: "",
      warehouse: null,
    };
  }

  return { invoice: "", line: "", unit_quantity: "0", record: "", warehouse: null };
};
