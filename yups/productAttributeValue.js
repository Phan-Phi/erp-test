import { object, array, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default (data) => {
  if (data === undefined) {
    return yupResolver(
      object().shape({
        attributes: array(mixed()),
      })
    );
  }

  const { choice, type } = data;

  return yupResolver(object().shape({}));
};

export const defaultFormState = (data) => {
  if (data === undefined) {
    return {
      attributes: [],
    };
  }

  const { choice, type } = data;

  return {};
};
