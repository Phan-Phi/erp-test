import { formatPhoneNumber as originalFormatPhoneNumber } from "react-phone-number-input";

export const formatPhoneNumber = (value = "") => {
  return originalFormatPhoneNumber(value);
};
