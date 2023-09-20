import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

export interface ChangePasswordSchemaProps {
  password: string;
  confirm_password: string;
}

export const changePasswordSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        password: string().required().trim().min(8).max(256),
        confirm_password: string().required().trim().min(8).max(256),
      })
    );
  }

  return yupResolver(
    object().shape({
      password: string().required().trim().min(8).max(256),
      confirm_password: string().required().trim().min(8).max(256),
    })
  );
};

export const defaultChangePasswordFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      password: "",
      confirm_password: "",
    };
  }

  return {
    password: "",
    confirm_password: "",
  };
};
