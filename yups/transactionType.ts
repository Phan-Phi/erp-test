import { string, object, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface TransactionTypSchemaProps {
  id?: number;
  name: string;
  is_business_activity: boolean;
  description: string;
}

export const transactionTypeSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        name: string().required(),
        is_business_activity: boolean(),
        description: string(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required(),
      is_business_activity: boolean(),
      description: string(),
    })
  );
};

export const defaultTransactionTypeFormState = (
  choice?: ChoiceType
): TransactionTypSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      is_business_activity: true,
      description: "",
    };
  }

  return {
    name: "",
    is_business_activity: true,
    description: "",
  };
};
