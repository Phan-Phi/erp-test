import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface CustomerTypeSchemaProps {
  id?: number;
  name: string;
  description: string;
  parent: null | object;
  level?: number;
  full_name?: string;
}

export const customerTypeSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        name: string().required().trim(),
        description: string().trim(),
        parent: mixed(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required().trim(),
      description: string().trim(),
      parent: mixed(),
    })
  );
};

export const defaultCustomerTypeFormState = (
  choice?: ChoiceType
): CustomerTypeSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      description: "",
      parent: null,
    };
  }

  return {
    name: "",
    description: "",
    parent: null,
  };
};
