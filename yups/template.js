import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default (data) => {
  if (data === undefined) {
    return yupResolver(object().shape({}));
  }

  const { choice, type } = data;

  return yupResolver(object().shape({}));
};

export const defaultFormState = (data) => {
  if (data === undefined) {
    return {};
  }

  const { choice, type } = data;

  return {};
};
