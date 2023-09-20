import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ChoiceType } from "interfaces";

export interface LoginSchemaProps {
  username: string;
  password: string;
}

export const loginSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        username: string().required(),
        password: string().required(),
      })
    );
  }

  return yupResolver(
    object().shape({
      username: string().required(),
      password: string().required(),
    })
  );
};

export const defaultLoginFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      username: "",
      password: "",
    };
  }

  return {
    username: "",
    password: "",
  };
};
