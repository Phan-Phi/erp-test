import { string, object, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface PaymentMethodSchemaProps {
  id?: number;
  name: string;
  description: string;
}

export const paymentMethodSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        name: string().required(),
        description: string(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required(),
      description: string(),
    })
  );
};

export const defaultPaymentMethodFormState = (
  choice?: ChoiceType
): PaymentMethodSchemaProps => {
  if (choice == undefined) {
    return {
      name: "",
      description: "",
    };
  }

  return {
    name: "",
    description: "",
  };
};
