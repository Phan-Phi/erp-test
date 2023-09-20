import { object, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChoiceType } from "interfaces";

import { PERMISSION_ITEM } from "interfaces";

interface ExtendPermissionItem extends PERMISSION_ITEM {
  checked: boolean;
  permissionId?: number;
}

export interface UserPermissionSchemaProps {
  permissions: ExtendPermissionItem[];
}

export const userPermissionSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        permissions: array(object()),
      })
    );
  }

  return yupResolver(
    object().shape({
      permissions: array(object()),
    })
  );
};

export const defaultUserPermissionFormState = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return {
      permissions: [],
    };
  }

  return {
    permissions: [],
  };
};
