import { string, object, mixed, boolean, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType, DefaultVariant } from "interfaces";

export interface ProductSchemaProps {
  id?: number;
  product_class: object | null;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  publication_date: Date;
  available_for_purchase: Date;
  default_variant?: DefaultVariant;
}

export const productSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        product_class: mixed().required(),
        name: string().required(),
        description: string(),
        meta_title: string(),
        meta_description: string(),
        is_published: boolean(),
        publication_date: date().nullable(),
        available_for_purchase: date().nullable(),
        stop_business: boolean().notRequired(),
      })
    );
  }

  return yupResolver(
    object().shape({
      product_class: mixed().required(),
      name: string().required(),
      description: string(),
      meta_title: string(),
      meta_description: string(),
      is_published: boolean(),
      publication_date: date().nullable(),
      available_for_purchase: date().nullable(),
      stop_business: boolean().notRequired(),
    })
  );
};

export const defaultProductFormState = (choice?: ChoiceType): ProductSchemaProps => {
  if (choice === undefined) {
    return {
      product_class: null,
      name: "",
      description: "",
      meta_title: "",
      meta_description: "",
      is_published: false,
      seo_title: "",
      seo_description: "",
      publication_date: new Date(),
      available_for_purchase: new Date(),
    };
  }

  return {
    product_class: null,
    name: "",
    description: "",
    meta_title: "",
    meta_description: "",
    is_published: false,
    seo_title: "",
    seo_description: "",
    publication_date: new Date(),
    available_for_purchase: new Date(),
  };
};
