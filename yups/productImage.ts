import { string, object, mixed, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface IImage {
  id?: number;
  alt: string;
  formId?: string;
  file: File | string;
  sort_order: number;
}

export interface ProductImageSchemaProps {
  images: IImage[];
}

export const productImageSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        images: array(
          object().shape({
            image: mixed(),
            sort_order: string(),
            alt: string(),
          })
        ),
      })
    );
  }

  return yupResolver(
    object().shape({
      images: array(
        object().shape({
          image: mixed(),
          sort_order: string(),
          alt: string(),
        })
      ),
    })
  );
};

export const defaultProductImageFormState = (
  choice?: ChoiceType
): ProductImageSchemaProps => {
  if (choice === undefined) {
    return {
      images: [],
    };
  }
  return {
    images: [],
  };
};
