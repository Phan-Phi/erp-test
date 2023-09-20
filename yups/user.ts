import { string, object, date, mixed, boolean, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { getChoiceValue } from "../libs";

import { validatePhoneNumber } from "./utils";
import { ChoiceType } from "interfaces";

export interface UserSchemaProps {
  id?: number;
  avatar: ({ file: File } | { file: string })[];
  username: string;
  email: string;
  main_phone_number: string;
  first_name: string;
  last_name: string;
  note: string;
  birthday: string | Date | null;
  gender: string;
  facebook: string;
  is_staff: boolean;
  is_active: boolean;
}

export const userSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        avatar: array(mixed()),
        username: string(),
        email: string().nullable().trim().lowercase().email(),
        main_phone_number: validatePhoneNumber(),
        first_name: string().trim(),
        last_name: string().trim(),
        note: string(),
        birthday: date().nullable(),
        gender: string(),
        facebook: string().url(),
        is_staff: boolean(),
        is_active: boolean(),
      })
    );
  }

  const { genders } = choice;

  return yupResolver(
    object().shape({
      avatar: array(mixed()),
      username: string(),
      email: string().nullable().trim().lowercase().email(),
      main_phone_number: validatePhoneNumber(),
      first_name: string().trim(),
      last_name: string().trim(),
      note: string(),
      birthday: date().nullable(),
      gender: string().oneOf(getChoiceValue(genders)),
      facebook: string().url(),
      is_staff: boolean(),
      is_active: boolean(),
    })
  );
};

export const defaultUserFormState = (choice?: ChoiceType): UserSchemaProps => {
  if (choice === undefined) {
    return {
      avatar: [],
      username: "",
      email: "",
      main_phone_number: "",
      first_name: "",
      last_name: "",
      note: "",
      birthday: null,
      gender: "",
      facebook: "",
      is_staff: false,
      is_active: true,
    };
  }

  const { genders } = choice;

  return {
    avatar: [],
    username: "",
    email: "",
    main_phone_number: "",
    first_name: "",
    last_name: "",
    note: "",
    birthday: null,
    gender: getChoiceValue(genders)[0],
    facebook: "",
    is_staff: false,
    is_active: true,
  };
};
