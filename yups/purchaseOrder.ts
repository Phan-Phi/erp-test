import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";
import { ChoiceType } from "interfaces";

export interface PurchaseOrderSchemaProps {
  id?: number;
  status: string;
  warehouse: object | null;
  partner: object | null;
  notes: string;
}

export const purchaseOrderSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        status: mixed(),
        warehouse: mixed().required(),
        partner: mixed().required(),
        notes: string(),
      })
    );
  }

  const { purchase_order_statuses } = choice;

  return yupResolver(
    object().shape({
      status: string().oneOf(getChoiceValue(purchase_order_statuses)),
      warehouse: mixed().required(),
      partner: mixed().required(),
      notes: string(),
    })
  );
};

export const defaultPurchaseOrderFormState = (
  choice?: ChoiceType
): PurchaseOrderSchemaProps => {
  if (choice === undefined) {
    return {
      status: "",
      warehouse: null,
      partner: null,
      notes: "",
    };
  }

  const { purchase_order_statuses } = choice;

  return {
    status: getChoiceValue(purchase_order_statuses)[0],
    warehouse: null,
    partner: null,
    notes: "",
  };
};
