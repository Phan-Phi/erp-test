import { string, object, mixed, boolean, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import isEmpty from "lodash/isEmpty";

export default (data) => {
  if (data === undefined) {
    return yupResolver(
      object().shape({
        options: array(
          object().shape({
            name: string().required().trim(),
            value: string().required().trim(),
            attribute: string().nullable(),
          })
        ).test({
          name: "validate",
          message: "Trường này không được bỏ trống",
          test: (value) => {
            if (isEmpty(value)) {
              return false;
            }

            return true;
          },
        }),
      })
    );
  }

  const { choice, type } = data;

  return yupResolver(
    object().shape({
      name: mixed().required().trim(),
      value: string().required().trim(),
      attribute: string().nullable(),
    })
  );
};

export const defaultFormState = (data) => {
  if (data === undefined) {
    return {
      name: "",
      value: "",
      attribute: null,
    };
  }

  const { choice, type } = data;

  return {
    name: "",
    value: "",
    attribute: null,
  };
};
