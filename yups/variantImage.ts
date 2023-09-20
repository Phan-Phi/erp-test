import { object, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

interface IImage {
  id: number;
  alt: string;
  file: string;
  sort_order: number;
  formId?: string;
  connectId?: number;
}

export interface VariantImageSchemaProps {
  images: IImage[];
}

export const variantImageSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        images: array(object()),
      })
    );
  }

  return yupResolver(
    object().shape({
      images: array(object()),
    })
  );
};

export const defaultVariantImageFormState = (
  choice?: ChoiceType
): VariantImageSchemaProps => {
  if (choice == undefined) {
    return {
      images: [],
    };
  }

  return {
    images: [],
  };
};
