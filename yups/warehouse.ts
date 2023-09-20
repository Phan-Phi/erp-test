import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";
// import { ADMIN_WAREHOUSES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

export interface WarehouseSchemaProps {
  id?: number;
  name: string;
  primary_address?: object;
  is_used?: boolean;
  // manager?: any;
}

export const warehouseSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    // return ADMIN_WAREHOUSES_POST_YUP_RESOLVER;
    return yupResolver(
      object().shape({
        name: string().notRequired(),
        // manager: mixed(),
      })
    );
  }

  // return ADMIN_WAREHOUSES_POST_YUP_RESOLVER;
  return yupResolver(
    object().shape({
      name: string().notRequired(),
      // manager: mixed(),
    })
  );
};

export const defaultWarehouseFormState = (choice?: ChoiceType): WarehouseSchemaProps => {
  if (choice === undefined) {
    return {
      name: "",
      // manager: null,
    };
  }

  return {
    name: "",
    // manager: null,
  };
};
