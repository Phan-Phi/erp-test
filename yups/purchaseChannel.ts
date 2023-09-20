import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface PurchaseChannelSchemaProps {
  id?: number;
  name: string;
  description: string;
}

export const purchaseChannelSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
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

export const defaultPurchaseChannelFormState = (
  choice?: ChoiceType
): PurchaseChannelSchemaProps => {
  if (choice === undefined) {
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
