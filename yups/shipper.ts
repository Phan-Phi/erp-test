import { ChoiceType } from "interfaces";
import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface ShipperSchemaProps {
  name: string;
  user: object | null;
  id?: number;
}

export const shipperSchema = (choice?: ChoiceType) => {
  if (choice == undefined) {
    return yupResolver(
      object().shape({
        name: string().required(),
        user: mixed(),
      })
    );
  }

  return yupResolver(
    object().shape({
      name: string().required(),
      user: mixed(),
    })
  );
};

export const defaultShipperFormState = (choice?: ChoiceType): ShipperSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      user: null,
    };
  }

  return {
    name: "",
    user: null,
  };
};
