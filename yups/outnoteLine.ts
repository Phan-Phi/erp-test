import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface OutnoteLineSchemaProps {
  id?: number;
  stock_out_note: string;
  variant: object | null;
  unit_quantity: string;
  unit: string | null;
}

export const outnoteLineSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        unit: string().nullable(),
        unit_quantity: string(),
        stock_out_note: string(),
        variant: mixed(),
      })
    );
  }

  return yupResolver(
    object().shape({
      unit: string().nullable(),
      unit_quantity: string(),
      stock_out_note: string(),
      variant: mixed(),
    })
  );
};

export const defaultOutnoteLineFormState = (
  choice?: ChoiceType
): OutnoteLineSchemaProps => {
  if (choice == undefined) {
    return {
      unit: null,
      unit_quantity: "1",
      stock_out_note: "",
      variant: null,
    };
  }

  return {
    unit: null,
    unit_quantity: "1",
    stock_out_note: "",
    variant: null,
  };
};
