import { object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface ConnectProductAttributeSchemaProps {
  id?: number;
  attribute: object | null;
  product_class: string;
}

export const connectProductAttributeSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        attribute: mixed().required(),
        product_class: mixed().required(),
      })
    );
  }

  return yupResolver(
    object().shape({
      attribute: mixed().required(),
      product_class: mixed().required(),
    })
  );
};

export const defaultConnectProductAttributeFormState = (
  choice?: ChoiceType
): ConnectProductAttributeSchemaProps => {
  if (choice === undefined) {
    return {
      attribute: null,
      product_class: "",
    };
  }

  return {
    attribute: null,
    product_class: "",
  };
};
