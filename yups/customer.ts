import { string, object, date, mixed, boolean, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";
import { validatePhoneNumber } from "./utils";

import { ChoiceType, Price } from "interfaces";

export interface CustomerSchemaProps {
  id?: number;
  birthday: Date | null;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  avatar: {
    file: string | File;
  }[];
  gender: string;
  facebook: string;
  tax_identification_number: string;
  company_name: string;
  type: object | null;
  in_business: boolean;
  sale_in_charge?: object | null;
  max_debt?: Price;
}

export const customerSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        first_name: string().trim(),
        last_name: string().trim(),
        email: string().nullable().trim().lowercase().email(),
        birthday: date().nullable(),
        avatar: array(mixed()),
        gender: string(),
        facebook: string().url(),
        tax_identification_number: string().max(20).nullable(),
        company_name: string(),
        type: mixed(),
        main_phone_number: validatePhoneNumber(),
        note: string(),
        in_business: boolean(),
      })
    );
  }

  const { genders } = choice;

  return yupResolver(
    object().shape({
      first_name: string().trim().max(256),
      last_name: string().trim().max(256),
      email: string().nullable().trim().lowercase().email().max(254),
      birthday: date().nullable(),
      avatar: array(mixed()),
      gender: mixed().oneOf(getChoiceValue(genders)),
      facebook: string().url().max(200),
      tax_identification_number: string().max(20).nullable(),
      company_name: string().max(255),
      type: mixed(),
      main_phone_number: validatePhoneNumber(),
      note: string(),
      in_business: boolean().default(true),
    })
  );
};

export const defaultCustomerFormState = (choice?: ChoiceType): CustomerSchemaProps => {
  if (choice == undefined) {
    return {
      birthday: null,
      email: "",
      main_phone_number: "",
      first_name: "",
      last_name: "",
      note: "",
      avatar: [],
      gender: "",
      facebook: "",
      tax_identification_number: "",
      company_name: "",
      type: null,
      in_business: true,
    };
  }

  const { genders } = choice;

  return {
    birthday: null,
    email: "",
    main_phone_number: "",
    first_name: "",
    last_name: "",
    note: "",
    avatar: [],
    gender: getChoiceValue(genders)[0],
    facebook: "",
    tax_identification_number: "",
    company_name: "",
    type: null,
    in_business: true,
  };
};
