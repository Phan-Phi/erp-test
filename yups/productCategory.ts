import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface ProductCategorySchemaProps {
  id?: number;
  name: string;
  description: string;
  parent: null | object;
}

export const productCategorySchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        name: string().required().trim(),
        description: string().trim(),
        parent: mixed().nullable(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required().trim(),
      description: string().trim(),
      parent: mixed().nullable(),
    })
  );
};

export const defaultProductCategoryFormState = (
  choice?: ChoiceType
): ProductCategorySchemaProps => {
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
